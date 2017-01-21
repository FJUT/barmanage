require.ensure(['jquery', 'vue'], function() {
  var $ = require('jquery')
  var Vue = require('vue')

  var vm = new Vue({
    el: '#app',
    data() {
      return {
        rows: rows
      }
    },
    methods: {
      deleteById(id) {
        if (!confirm('确认删除')) {
          return
        }

        $.ajax({
          url: '/occupy/deleteOccupy',
          type: 'post',
          data: {
            id: id
          }
        }).done(function(response) {
          // console.log(response)

          vm.rows = vm.rows.filter(function(row) {
            return row.id != id
          })
        })
      },
      plusRow() {
        var unsaved = this.rows.find(function(row) {
          return row.id === -1
        })

        if (unsaved) {
          return
        }

        this.rows.push({
          id: -1,
          price: '',
          seconds: '',
          BarId: barInfo.id
        })
      },
      cancelPlus() {
        this.rows.pop()
      },
      doPlus() {
        var last = this.rows[this.rows.length - 1]
        if (!last.price) return
        if (!last.seconds) return

        $.ajax({
          url: '/occupy/addRow',
          type: 'post',
          data: {
            price: last.price,
            seconds: last.seconds,
            BarId: barInfo.id
          }
        }).done((response) => {
          if (response.iRet == 0) {
            // vm.rows[vm.rows.length - 1] = response.created

            vm.rows.pop()
            vm.rows.push(response.created)
          }
        })
      }
    }
  })
})