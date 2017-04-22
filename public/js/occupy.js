const validator = require('validator')
const $ = require('jquery')
const Vue = require('vue')

var vm = new Vue({
  el: '#app',
  data() {
    return {
      rows: [],
      barInfo: null,
      screenStatus: 'close'
    }
  },
  mounted: function () {
    this.rows = window.rows
    this.barInfo = window.barInfo
    this.screenStatus = window.screenStatus
  },
  computed: {
    isScreenOpen:function() {
      return this.screenStatus == 'open'
    }
  },
  methods: {
    editById(id) {
      this.rows = this.rows.map(row => {
        if (row.id == id) {
          row.edit = true
        }

        return row
      })
    },

    cancelUpdate(id) {
      this.rows = this.rows.map(row => {
        if (row.id == id) {
          row.edit = false
        }

        return row
      })
    },

    doUpdate(id) {
      var row = this.rows.find(row => row.id == id)
      var {price, seconds, id} = row

      if (!validator.isNumeric(String(price)) || !validator.isNumeric(String(seconds))) {
        alert('请输入有效数字')
        return
      }

      $.ajax({
        url: '/occupy/updateRow',
        type: 'post',
        data: {
          price,
          seconds,
          id
        }
      }).done(response => {

        if (response.iRet == 0) {
          this.rows = this.rows.map(row => {
            if (row.id == id) {
              row.edit = false
            }

            return row
          })
        }

      })
    },

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
      }).done(function (response) {
        // console.log(response)

        vm.rows = vm.rows.filter(function (row) {
          return row.id != id
        })
      })
    },

    plusRow() {
      var unsaved = this.rows.find(function (row) {
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
      var {price, seconds} = last

      if (!validator.isNumeric(String(price)) || !validator.isNumeric(String(seconds))) {
        alert('请输入有效数字')
        return
      }

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
    },

    openScreen() {
      setTimeout(function () {
        $.ajax({
          url: '/ajax/getBapingStatus',
          data: {barId: this.barInfo.id}
        }).done((res) => {
          if(res.iRet == 0) {
            vm.screenStatus = res['data']['bp']
            console.log("screenStatus=>", vm.screenStatus)
          }
        })
      }, 2000)
    },

    closeScreen() {
      setTimeout(function () {
        $.ajax({ url: '/occupy/closeScreen',}).done((res) => {
          if(res.iRet == 0) {
            vm.screenStatus = "close"
            console.log("screenStatus=>", this.screenStatus)
          } else {
            console.error(res['msg'])
          }
        })
      }, 2000)
    }
  }
})
