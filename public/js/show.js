/**
 * Created by shinan on 2017/1/24.
 */
import Vue from 'vue'
import Carousel3d from 'vue-carousel-3d'

Vue.use(Carousel3d)

const LocalPage = {
  init: function() {
    let app = new Vue({
      el: '#app',
      data() {
        var images = window.messages.filter(o => o.photo == 1)

        return {
          images
        }
      }
    })
  }
}

LocalPage.init()