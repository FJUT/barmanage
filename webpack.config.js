/**
 * Created by Administrator on 2017/1/19.
 */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    form: './public/js/form.js'
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
  target: 'web'
};
