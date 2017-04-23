/**
 * Created by shinan on 2017/1/24.
 */
var $ = window.$
import Vue from 'vue'
import Carousel3d from 'vue-carousel-3d'

const ANIMATION_TYPES = {
  normal: ['pieces10', 'pieces30'],
  spec: ['pieces17', 'pieces58', 'pieces72']
}

Vue.use(Carousel3d)

const LIMIT = 5
const PLAY_INTERVAL = 2000
let allMessages = window.messages

// 更新霸屏状态
const setBapingDisplay = id => {
  return $.ajax({
    url: '/show/setMessageDisplay',
    method: 'POST',
    data: {
      id: id
    }
  })
}

// 获取未显示的霸屏
const getPendingBaping = () => {
  return $.ajax({
    url: '/show/getPendingBaping'
  })
}

const LocalPage = {
  init: function() {
    let app = new Vue({
      el: '#app',
      data() {
        var images = window.messages.filter(o => o.msgImage)
        var messages = allMessages.slice(0, LIMIT)

        return {
          images,
          messages,
          bapingShow: false,
          bapingMessage: null
        }
      },
      mounted() {
        if (this.messages.length > 2) {
          this.initAutoScroll()
        }

        // 轮询霸屏消息
        this.pollBaping()

        // 轮询普通消息
        this.pollNormalMessages()
      },
      methods: {
        // 霸屏图片动画特效
        autoPlay(seconds) {
          var types = this.bapingMessage.lv >= 5 ? ANIMATION_TYPES.spec : ANIMATION_TYPES.normal
          var index = 0
          var imgHtml = `<img src="${this.bapingMessage.msgImage}" class="img-holder" alt="">`
          var t = Date.now()

          var play = () => {
            $('#preview').html(imgHtml)
            
            setTimeout(() => {
              $('#preview img').pieces({
                onStart: {
                  animation: types[index],
                  overwrite: false,
                  speed: 40,
                  delay: 4,
                  onComplete: function() {
                    var now = Date.now()

                    if ((now - t) / 1000 >= seconds) {
                      return
                    }

                    index++

                    if (index >= types.length) {
                      index = 0
                    }

                    play()
                  }
                },
                rows: 6,
                cols: 6
              })
            }, 17)
          }

          play()
        },
        // 获取最新消息
        pollNormalMessages() {
          const poll = () => {
            var lastMessageId = Math.max.apply(Math, allMessages.map(msg => msg.id))

            $.ajax({
              url: '/show/getNewMessages',
              data: {
                lastMessageId
              }
            })
            .done(response => {
              if (response.iRet != 0) {
                return
              }

              if (response.data.length == 0) {
                return
              }

              allMessages = allMessages.concat(response.data)
              
              // 如果已经存在滚屏，直接返回
              if (this.ticker) {
                return
              }

              // 否则初始化滚屏
              this.messages = allMessages.slice(0, LIMIT)
              if (this.messages.length > 2) {
                this.initAutoScroll()
              }
            })
            .always(() => setTimeout(poll, 10000))
          }

          poll()
        },
        // 获取未播放的霸屏
        pollBaping() {
          getPendingBaping()
          .done(response => {
            if (response.iRet != 0) {
              console.log('获取霸屏失败')
              return
            }

            // 如果没有霸屏，3秒后再查
            if (!response.data) {
              setTimeout(() => this.pollBaping(), 3000)
              return
            }

            // 如果有，更新视图，显示霸屏
            this.bapingMessage = response.data
            this.bapingShow = true

            // 开始霸屏倒计时
            this.$nextTick(
              () => this.startBapingCount()
            )
          })
          .fail(err => {
            console.log('获取霸屏失败')
            setTimeout(() => this.pollBaping(), 3000)
          })
        },
        // 霸屏倒计时并显示动画效果
        startBapingCount() {
          var seconds = this.bapingMessage.seconds
          var ticker = setInterval(() => {
            seconds--
            this.$set(this.bapingMessage, 'seconds', seconds)

            if (seconds == 0) {
              clearInterval(ticker)
              this.endBapingCountCallback()
            }
          }, 1000)

          this.autoPlay(seconds)
        },
        // 霸屏倒计时结束
        endBapingCountCallback() {
          setBapingDisplay(this.bapingMessage.id)
            .done(res => {
              this.bapingShow = false
              this.bapingMessage = null
            })
            .fail(err => alert('更新霸屏状态失败'))
            .always(() => this.pollBaping())
        },
        // 消息滚屏
        initAutoScroll() {
          var vm = this
          var scroller = $('.msg-box')

          // scroller.on('webkitTransitionEnd', e => {
          //   scroller.css({
          //       transition: 'none'
          //     })
          //
          //     scroller.css({
          //       transform: '',
          //       webkitTransform: ''
          //     })
          //
          //     allMessages.push(allMessages.shift())
          //     vm.messages = allMessages.slice(0, LIMIT)
          // })

          this.ticker = setInterval(() => {
            var firstItem = scroller.find('.msg-item').first()
            var dis = firstItem.outerHeight() + 10

            scroller.css({
              transition: 'transform .5s ease-in-out'
            })

            scroller.css({
              transform: `translateY(-${dis}px)`,
              webkitTransform: `translateY(-${dis}px)`
            })

            setTimeout(() => {
              scroller.css({
                transition: 'none'
              })

              scroller.css({
                transform: '',
                webkitTransform: ''
              })

              allMessages.push(allMessages.shift())
              vm.messages = allMessages.slice(0, LIMIT)
            }, 510)
          }, PLAY_INTERVAL)
        }
      }
    })
  }
}

LocalPage.init()
