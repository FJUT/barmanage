import $ from 'jquery'
import Vue from 'vue'
import Element from 'element-ui'
require("bootstrap")

Vue.use(Element)

const app = new Vue({
  el: '#app',
  data: function () {
    return {
      messages: [],
      //订单每页显示数
      messagePerPageCount: 20,
      //订单总页数
      messagePages: 0,
      //订单当前显示页数
      messagePageIndex: 1,
      //当前显示的订单
      messageCurShow: [],
      //读数据等待变量
      messageLoading: false
    }
  },
  mounted: function () {
    this.messages = window.messages
  },
  watch: {
    messages: function (val) {
      //计算页数
      this.messagePages = Math.ceil(val.length % this.messagePerPageCount)

      //当前展示的
      this.messageCurShow = this.getCurShow(val, this.messagePageIndex, this.messagePerPageCount)
    },

    messagePageIndex: function (val) {
      this.messageCurShow = this.getCurShow(this.messages, this.messagePageIndex, this.messagePerPageCount)
    }
  },
  methods: {
    onMessagePageChange: function (val) {
      this.messagePageIndex = val
    },

    deleteById(id, index) {
      $.ajax({
        url: '/message/del',
        type: 'POST',
        data: {
          id: id
        }
      }).done(response => {
        if (response.iRet != 0) {
          alert('删除失败')
          return
        }

        this.messages.splice(index, 1)
      })
    },

    handleDelete: function (index, rowData) {
      $.ajax({
        url: '/message/del',
        type: 'POST',
        data: {
          id: rowData.id
        }
      }).done(response => {
        if (response.iRet != 0) {
          alert('删除失败')
          return
        }

        this.messages.splice(index, 1)
      })
    },

    getCurShow: function (target, curIndex, numPerPage) {
      let _target = target//this.$data['news']
      let _curRet = []
      let _curPageIndex = curIndex //this.$data['newsPageIndex']
      let _numPerPage = numPerPage //this.$data['newsPerPageCount']
      if (_target.length < _numPerPage) {
        $.extend(true, _curRet, _target)
      } else {
        for (let _it in _target) {
          if (_it >= (_curPageIndex - 1) * _numPerPage && _it < _curPageIndex * _numPerPage) {
            _curRet.push(_target[_it])
          }
        }
      }
      return _curRet
    }
  }
})


$('.el-table__body-wrapper table').on("click", '.cell img', function (target) {
  $('.imagepreview').attr('src', $(this).attr('src'));
  $('#imagemodal').modal();
})

