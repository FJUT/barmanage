import $ from 'jquery'
import Vue from 'vue'

const app = new Vue({
  el: '#app',
  data: function() {
    
    return {
      orders: window.orders
    }
  }
})