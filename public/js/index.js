/*
* 通过require.ensure方法创建分裂点，require.ensure方法中第一个参数引用的模块，会被单独打包到chunk文件中，并通过jsonp的方式动态加载
* */
require.ensure(['jquery', 'vue'], function() {
  var $ = require('jquery')
  var Vue = require('vue')

  console.log($)
  console.log(Vue)
})