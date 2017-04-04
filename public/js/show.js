/**
 * Created by shinan on 2017/1/24.
 */
import $ from 'jquery'
import Vue from 'vue'
import Carousel3d from 'vue-carousel-3d'

Vue.use(Carousel3d)

const LIMIT = 5
const PLAY_INTERVAL = 2000
const allMessages = window.messages
const setBapingDisplay = id => {
  return $.ajax({
    url: '/show/setMessageDisplay',
    method: 'POST',
    data: {
      id: id
    }
  })
}

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
        var images = window.messages.filter(o => o.msgType == 1)
        var messages = allMessages.slice(0, LIMIT)

        return {
          images,
          messages,
          bapingShow: false,
          bapingMessage: null
        }
      },
      mounted() {
        this.initAutoScroll()

        // 轮询霸屏消息
        this.pollBaping()
      },
      methods: {
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

          var ticker = setInterval(() => {
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