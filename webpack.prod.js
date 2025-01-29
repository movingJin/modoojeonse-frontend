const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devServer: {
        port: 8083,
        open: true,
        static: path.resolve(__dirname, 'dist'),
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    optimization: {
        splitChunks: {
          minSize: 10000,
          maxSize: 250000,
        }
    }
});