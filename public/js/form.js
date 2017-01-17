/**
 * Created by 99171 on 2017/1/17.
 */
var vm = new Vue({
  el: '#app',
  data: function() {
    return {
      timerange: [], /* [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)] */
      provinces: provinces,
      cities: cities,
      pIndex: 0,
      cIndex: 0,
      currProvince: provinces[0].name,
      currCity: cities[0].name,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  computed: {
    cityList: function() {
      return this.cities[this.currProvince]
    }
  },
  methods: {
    handleNodeClick: function(data) {
      console.log(data)
    },
    handleProvChange: function(data) {
      console.log(arguments)
    }
  },
  mounted: function() {
    var map = new qq.maps.Map(document.getElementById('mapContainer'));
    map.panTo(new qq.maps.LatLng(39.916527,116.397128));
  }
});