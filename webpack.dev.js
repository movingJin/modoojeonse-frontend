const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8083,
    open: true,
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
    hot: true,
  }
});