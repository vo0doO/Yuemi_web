var webpack = require('webpack');
var path = require('path');

module.exports = {
	devtool: 'inline-sourcemap',
	entry: [
		'./src/index.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: "dist/",
		filename: 'bundle.js'
	},
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8081',
				secure: false
			}
		}
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(node_modules)/,
			loader: 'babel-loader',
			query: {
				presets: ['react', 'env', 'stage-0']
			}
		}]
	}
};
