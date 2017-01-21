require.ensure(['jquery', 'vue'], function() {
  const $ = require('jquery')
  const Vue = require('vue')
  const Element = require('element-ui')

  require('./city-select')

  /* 注册需要使用的组件 */
  var { TimeSelect } = Element
  Vue.component(TimeSelect.name, TimeSelect)

  var vm = new Vue({
    el: '#app',
    data () {
      if (!barInfo.photos) {
        barInfo.photos = []
      } else {
        barInfo.photos = JSON.parse(barInfo.photos)
      }

      if (!barInfo.bussinesshours) {
        barInfo.bussinesshours = JSON.stringify(['00:00', '24:00'])
      }

      var range = JSON.parse(barInfo.bussinesshours)
      var [ startTime, endTime ] = range

      var model = {
        pickerOptions: {
          start: '00:00',
          step: '00:30',
          end: '24:00'
        },
        startTime: startTime,
        endTime: endTime,
        ...barInfo
      }

      return model
    },
    methods: {
      handleLogoChange(e) {
        var t = this
        var data = new FormData()
        data.append('logo', e.target.files[0])

        $.ajax({
          url: '/upload',
          type: 'POST',
          data: data,
          processData: false,
          contentType: false,
          success: function (response) {
            t.logo = response.url
          }
        })
      },
      handlePhotosChange(e) {
        var t = this
        var data = new FormData()

        for (var i = 0; i < e.target.files.length; i++) {
          data.append('photos', e.target.files[i])
        }

        $.ajax({
          url: '/uploadMulti',
          type: 'POST',
          data: data,
          processData: false,
          contentType: false,
          success(response) {
            if (response.iRet == 0) {
              t.photos = t.photos.concat(response.photos)
            }
          }
        })
      },
      deletePhoto(url) {
        this.photos = this.photos.filter(function (photo) {
          return photo != url
        })
      },
      save(e) {
        e.preventDefault()

        $.ajax({
          url: '/saveForm',
          type: 'post',
          dataType: 'json',
          data: {
            barInfo: {
              id: this.id,
              name: this.name,
              logo: this.logo,
              photos: JSON.stringify(this.photos),
              bussinesshours: JSON.stringify([this.startTime, this.endTime]),
              city: this.city,
              address: this.address,
              summary: this.summary
            }
          }
        }).done((response) => {
          alert('修改成功')
        })
      }
    },
    mounted() {
      // 初始化地图选择
      // var map = new qq.maps.Map(document.getElementById('mapContainer'));
      // 初始化城市选择
      var $citySelect = $('#citySelect')
      $citySelect.citySelect({
        setName: false
      })
        .on("citySelect", (event, name, code) => {
          $citySelect.val(name)
        })
    }
  })
})

