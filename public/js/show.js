/**
 * Created by shinan on 2017/1/24.
 */
require('../css/animate.css')

var bool = false

var temp1 = {
  user: '/images/wyf.jpg',
  time: 10,
  message: '大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健',
}

var temp2 = {
  user: '/images/zjl.jpg',
  time: 20,
  image: '/images/dbj.jpg'
}

const Vue = require('vue')
const vm = new Vue({
  el: '#app',
  data() {
    return {
      curr: undefined
    }
  },
  computed: {
    time() {
      return this.curr.time
    }
  },
  methods: {
    startCount() {
      var ticker = setInterval(() => {
        this.curr = {
          ...this.curr,
          time: this.curr.time - 1
        }

        if (this.curr.time === 0) {
          clearInterval(ticker)
          this.curr = null
        }
      }, 1000)
    }
  }
})

setTimeout(() => {
  vm.curr = temp1
}, 17)