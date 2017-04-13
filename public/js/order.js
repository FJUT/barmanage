import $ from 'jquery'
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element)

const app = new Vue({
  el: '#app',
  data: function() {
    return {
      order: [],
      //订单每页显示数
      orderPerPageCount: 20,
      //订单总页数
      orderPages: 0,
      //订单当前显示页数
      orderPageIndex: 1,
      //当前显示的订单
      orderCurShow: [],
    }
  },
  mounted: function () {
    this.order = window.orders
  },
  watch: {
    order: function (val) {
      //计算页数
      this.orderPages = Math.ceil(val.length % this.orderPerPageCount)

      //当前展示的
      this.orderCurShow = this.getCurShow(val, this.orderPageIndex, this.orderPerPageCount)
    },

    orderPageIndex: function (val) {
      this.orderCurShow = this.getCurShow(this.order, this.orderPageIndex, this.orderPerPageCount)
    }
  },
  methods: {
    onOrderPageChange: function (val) {
      this.orderPageIndex = val
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

        this.order.splice(index, 1)
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

        this.order.splice(index, 1)
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
