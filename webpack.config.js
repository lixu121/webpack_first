// webpack.config.js

const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
//首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];

module.exports = {
  entry: './src/index.js', //webpack默认配置
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: 'bundle.[hash:6].js',
    publicPath: '/' //通常是CDN地址
  },
  mode: isDev ? 'development' : 'production',
  //devtool: isDev ? false : 'cheap-module-eval-source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              {
                "corejs": 3
              }
            ]
          ]
        }
      },
      exclude: /node_modules/ //排除node_modules目录
    }, {
      test: /\.(le|c)ss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 2048, //2K
          esModule: false,
          name: '[name]_[hash:6].[ext]',
          outputPath: 'assets'
        }
      }],
      exclude: /node_modules/
    }, {
      test: /.html$/,
      use: 'html-withimg-loader'
    }]
  },
  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件
      config: config.template,
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      //hash: true //是否加上hash，默认是false
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
    })
  ]
}