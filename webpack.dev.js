const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    proxy: {
      '/api/*': {
        target: 'http://localhost:8081/',
        secure: false
      }
    }
  }
});
