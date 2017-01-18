/**
 * Created by 99171 on 2017/1/17.
 */
var vm = new Vue({
  el: '#app',
  data: function() {
    return {
      timerange: [], /* [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)] */
      photos: [],
      logo: ''
    }
  },
  methods: {
    handleLogoChange: function(e) {
      var t = this
      var data = new FormData()
      data.append('logo', e.target.files[0])

      $.ajax({
        url: '/upload',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function(response){
          t.logo = response.url
        }
      })
    },
    handlePhotosChange: function(e) {
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
        success: function(response){
          if (response.iRet == 0) {
            t.photos = t.photos.concat(response.photos)
          }
        }
      })
    },
    deletePhoto: function(url) {
      this.photos = this.photos.filter(function(photo) {
        return photo != url
      })
    },
    save: function() {

    }
  },
  mounted: function() {
    // 初始化地图选择
    var map = new qq.maps.Map(document.getElementById('mapContainer'));
    var $citySelect = $('#citySelect')

    // 初始化城市选择
    $citySelect.citySelect({
      setName: false
    }).on("citySelect", function(event, name, code) {
      $citySelect.val(name)
    })
  }
})