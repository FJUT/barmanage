/**
 * Created by shinan on 2017/1/24.
 */
const $ = window.$
import Vue from 'vue'
import Carousel3d from 'vue-carousel-3d'

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
        autoPlay() {
          var types = ['pieces10', 'pieces30']
          var index = 0
          var imgHtml = `<img id="bp-effected-img" src="${this.bapingMessage.msgImage}">`

          var play = function() {
            $('#preview').empty()
            $('#preview').html(imgHtml)

            $('#bp-effected-img').pieces({
              onStart: {
                animation: types[index],
                overwrite: true,
                speed: 40,
                delay: 4,
                onComplete: function() {
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
          }

          play()
        },
        // 获取最新消息
        pollNormalMessages() {
          const poll = () => {
            var lastMessageId = allMessages.length > 0 ? allMessages[allMessages.length - 1].id : ''

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
              alert('获取霸屏失败')
              return
            }

            if (!response.data) {
              setTimeout(() => this.pollBaping(), 3000)
              return
            }

            // 更新视图
            this.bapingMessage = response.data
            this.bapingShow = true

            this.startBapingCount()
            this.$nextTick(() => {
              this.autoPlay()
            })
          })
          .fail(err => {
            alert('获取霸屏失败')
            setTimeout(() => this.pollBaping(), 3000)
          })
        },
        // 霸屏倒计时
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

          scroller.on('webkitTransitionEnd', e => {
            scroller.css({
                transition: 'none'
              })

              scroller.css({
                transform: ''
              })

              allMessages.push(allMessages.shift())
              vm.messages = allMessages.slice(0, LIMIT)
          })

          this.ticker = setInterval(() => {
            var firstItem = scroller.find('.msg-item').first()
            var dis = firstItem.outerHeight() + 10

            scroller.css({
              transition: 'transform 500ms'
            })

            scroller.css({
              transform: `translate3d(0, -${dis}px, 0)`
            })
          }, PLAY_INTERVAL)
        }
      }
    })
  }
}

LocalPage.init()