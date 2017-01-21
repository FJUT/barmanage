/**
 * Created by Administrator on 2017/1/19.
 */
var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

module.exports = {
  entry: {
    form: './public/js/form.js'
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[name].bundle.js',
    chunkFilename: 'vendors.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { "presets": ["es2015"] }
    }]
  },
  target: 'web',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
  // plugins: [
  //   new CommonsChunkPlugin({
  //     name: ['jquery', 'vue', 'element-ui']
  //   })
  // ]
};
