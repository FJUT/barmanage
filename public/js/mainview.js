/**
 * Created by dengdongdong on 2017/4/5.
 */

const Vue = require('vue')
const $ = require('jquery')

//基于webpack正确引入jquery的方式之上，引入bootstap
import 'bootstrap/dist/js/bootstrap.min'

const vm = new Vue({
  el: '#app',
  data: function() {
    return {
      money: '12313',
      feedback: ''
    }
  },
  methods: {
    showBillDetail: function (event) {
      //使用bootstrap的组件modal
      let options = {}
      $('#billdetailModel').modal(options)
    },
    showMoreNews: function (event) {
      console.log("showMoreNews")
    }
  }
})
