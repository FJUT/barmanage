/**
 * Created by 99171 on 2017/1/19.
 */
$(function() {
  var vm = new Vue({
    el: '#app',
    data: function() {
      return {
        rows: rows
      }
    },
    methods: {
      deleteById: function(id) {
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
      plusRow: function() {
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
      cancelPlus: function() {
        this.rows.pop()
      },
      doPlus: function() {
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
        }).done(function(response) {
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