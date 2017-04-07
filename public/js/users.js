/**
 * Created by dengdongdong on 2017/4/5.
 */

const Vue = require('vue')
const $ = require('jquery')

import Element from 'element-ui'

Vue.use(Element)

const vm = new Vue({
  el: '#app',
  data: function() {
    return {
      err: window.error_message,

      //user
      user: [],
      //user每页显示数
      userPerPageCount: 8,
      //user总页数
      userPages: 0,
      //user当前显示页数
      userPageIndex: 1,
      //当前显示的订单
      userCurShow: [],
    }
  },
  mounted: function () {
    this.user = window._jiufu_user;
  },
  watch: {
    user:function (val) {
      //计算页数
      this.userPages = Math.ceil(val.length % this.userPerPageCount)

      //当前展示的新闻
      this.userCurShow = this.getCurShow(val, this.userPageIndex, this.userPerPageCount)
    }
  },
  methods: {


    userClick:function () {
    },

    genderformatter: function () {
      
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
    },
  }
})
