var webpack = require('webpack');

module.exports = function(env) {
  return {
    entry: {
      main: './public/js/index.js',
      form: './public/js/form.js',
      occupy: './public/js/occupy.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: './release',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { "presets": ["es2015"] }
      }]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js'
      }
    },
    plugins: [
      /*
        处理多个入口文件中公共引用的代码，使用Commons中间件,
        main和form两个入口文件里面公共引用的部分，会被合并到init.js里面
      */
      new webpack.optimize.CommonsChunkPlugin('init.js')
    ]
  }
}()

