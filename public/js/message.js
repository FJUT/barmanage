import $ from 'jquery'
import Vue from 'vue'

const app = new Vue({
  el: '#app',
  data: function() {
    return {
      messages: window.messages
    }
  },
  methods: {
    deleteById(id, index) {
      // this.messages.splice(index, 1)

      alert(index)

      $.ajax({
        url: '/message/del',
        type: 'POST',
        data: {
          id: id
        }
      })
      .done(response => {
        if (response.iRet != 0) {
          alert('删除失败')
          return
        }

        this.messages.splice(index, 1)
      })
    }
  }
})