/**
 * Created by Administrator on 2017/1/19.
 */
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules')

module.exports = {
  entry: {
    form: './public/js/form.js',
    vendors: ['vue', 'jquery', 'bootstrap']
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      },
      include: path.join(__dirname, 'src')
    }]
  },
  target: 'web',
  plugin: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
};
