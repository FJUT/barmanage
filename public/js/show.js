/**
 * Created by shinan on 2017/1/24.
 */
import $ from 'jquery'
import Vue from 'vue'
import Carousel3d from 'vue-carousel-3d'

Vue.use(Carousel3d)

const LIMIT = 5
const PLAY_INTERVAL = 2000

var allMessages = window.messages

var messageQueue = []
var baQueue = []
const lastMessageId = ''

const showBaping = () => {
  var message = baQueue.shift()
  var seconds = message.seconds

  setInterval(function() {
    seconds--

    if (seconds == 0) {
      // 检查霸屏队列长度，如果为0隐藏霸屏界面

      // 发请求修改消息isDisplay字段

    }
  }, 1000)
}

const fetchLatestMessage = () => {
  $.ajax({
    url: '/ajax/getLatestMessage',
    data: {
      lastMessageId: lastMessageId
    }
  })
    .done(res => {
      if (res.iRet == 0) {
        // 更新消息队列
        messageQueue = messageQueue.concat([res.data])

        var bapingMessages = res.data.filter(msg => {
          return msg.msgType == 2 && msg.isDisplay == false
        })

        baQueue = baQueue.concat([bapingMessages])

        if (baQueue.length > 0) {
          // 显示霸屏界面

          showBaping()
        }

      } else {
        alert('后台错误')
      }
    })
}

const LocalPage = {
  init: function() {
    let app = new Vue({
      el: '#app',
      data() {
        var images = window.messages.filter(o => o.msgType == 1)

        return {
          images,
          messages: allMessages.slice(0, LIMIT)
        }
      },
      mounted() {
        this.initAutoScroll()
      },
      methods: {
        initAutoScroll() {
          var vm = this
          var scroller = $('.msg-box')

          var ticker = setInterval(() => {
            var firstItem = scroller.find('.msg-item').first()
            var dis = firstItem.outerHeight() + 10

            scroller.css({
              transition: 'transform 500ms'
            })

            scroller.css({
              transform: `translate3d(0, -${dis}px, 0)`
            })

            setTimeout(() => {
              scroller.css({
                transition: 'none'
              })

              scroller.css({
                transform: ''
              })

              allMessages.push(allMessages.shift())
              vm.messages = allMessages.slice(0, LIMIT)
            }, 500)
          }, PLAY_INTERVAL)
        }
      }
    })
  }
}

LocalPage.init()