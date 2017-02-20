const $ = require('jquery')
const Vue = require('vue')
const Element = require('element-ui')
const { TimeSelect } = Element /* 注册需要使用的组件 */
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
      uploading: false,
      uploadingMulti: false,
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
          t.uploading = false
        }
      })

      t.uploading = true
    },
    handlePhotosChange(e) {
      var t = this
      var data = new FormData()

      var currentPhotoCount = this.photos.length
      var selectCount = e.target.files.length

      if (currentPhotoCount + selectCount > 5) {
        alert('最多上传5张图片，请返回重新选择或者删掉后再选')
        return
      }

      for (var i = 0; i < selectCount; i++) {
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

          t.uploadingMulti = false
        }
      })

      t.uploadingMulti = true
    },
    deleteLogo() {
      this.logo = ''
    },
    deletePhoto(url) {
      this.photos = this.photos.filter(function (photo) {
        return photo != url
      })
    },
    save(e) {
      e.preventDefault()

      if (this.uploading || this.uploadingMulti) {
        alert('文件正在上传，请稍后再提交')
        return false
      }

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
            position: this.position,
            summary: this.summary
          }
        }
      }).done((response) => {
        alert('修改成功')
      })
    },
    initMap() {
      // 初始化地图选择
      if (this.position) {
        var position = JSON.parse(this.position)
        var center = new qq.maps.LatLng(position[0], position[1])
        var map  = new qq.maps.Map(document.getElementById('map-container'), {
          zoom: 12,
          center: center
        })
      } else {
        var map  = new qq.maps.Map(document.getElementById('map-container'), {
          zoom: 12
        })
        // 如果没有存过position,自动获取本地地址
        var cs = new qq.maps.CityService({
          map : map,
          complete : function(results){
            let { lat, lng } = results.detail.latLng


            vm.position = JSON.stringify([lat, lng])
            vm.address = results.detail.name

            map.setCenter(results.detail.latLng)
          }
        });

        cs.searchLocalCity();
      }

      // 根据坐标取地理位置服务类实例化
      var geocoder = new qq.maps.Geocoder({
        complete:function(result){
          console.log(result)
          vm.city = result.detail.addressComponents.city
          vm.address = result.detail.address
        }
      });

      // 绑定地图点击事件获取坐标
      qq.maps.event.addListener(map, 'click', (event) => {
          let { lat, lng } = event.latLng
          vm.position = JSON.stringify([lat, lng]) // 更新position
          geocoder.getAddress(event.latLng)
        }
      )
    }
  },
  mounted() {
    this.initMap()
  }
})