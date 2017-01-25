/**
 * Created by shinan on 2017/1/24.
 */
require('../css/animate.css')
const Vue = require('vue')

var bool = false

var temp1 = {
  avatar: '/images/wyf.jpg',
  user: '吴亦凡',
  time: 5,
  message: '大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健大保健',
}

var temp2 = {
  avatar: '/images/zjl.jpg',
  user: '周杰伦',
  time: 10,
  image: '/images/dbj.jpg'
}

var list = [temp1, temp2]
var index = 0


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
  updated() {
    if (this.curr && !this.ticker) {
      this.startCount()
    }
  },
  methods: {
    startCount() {
      this.ticker = setInterval(() => {
        this.curr = {
          ...this.curr,
          time: this.curr.time - 1
        }

        if (this.curr.time === 0) {
          clearInterval(this.ticker)
          this.ticker = null
          this.curr = null

          setTimeout(() => {
            index = index + 1

            if (index >= list.length) {
              index = 0
            }

            this.curr = list[index]
          }, 1000)

        }
      }, 1000)
    }
  }
})

setTimeout(() => {
  vm.curr = list[index]
}, 17)