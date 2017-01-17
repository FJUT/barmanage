/**
 * Created by 99171 on 2017/1/17.
 */
var vm = new Vue({
  el: '#app',
  data: function() {
    return {
      // value3: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
      timerange: []
    };
  },
  mounted: function() {
    var map = new qq.maps.Map(document.getElementById('mapContainer'));
    map.panTo(new qq.maps.LatLng(39.916527,116.397128));
  }
});