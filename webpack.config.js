var webpack = require('webpack')
var path = require('path')

const outputPath = path.join(__dirname, 'release')

module.exports = function(env) {
  return {
    entry: {
      login: './public/js/login.js',
      mainview: './public/js/mainview.js',
      form: './public/js/form.js',
      show: './public/js/show.js',
      occupy: './public/js/occupy.js',
      order: './public/js/order.js',
      users: './public/js/users.js',
      message: './public/js/message.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: outputPath
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: { "presets": ["es2015"] }
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.common.js'
      }
    },
    plugins: [
      /*
       处理多个入口文件中公共引用的代码，使用Commons中间件,
       例如，main和form两个入口文件里面公共引用的部分，会被合并到init.js里面
       */
      new webpack.optimize.CommonsChunkPlugin('init.js'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
}()
