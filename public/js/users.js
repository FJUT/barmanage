/**
 * Created by dengdongdong on 2017/4/5.
 */

const Vue = require('vue')
const $ = require('jquery')

const vm = new Vue({
  el: '#app',
  data: function() {
    return {
      err: window.error_message
    }
  }
})