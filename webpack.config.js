const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.(png|jpg|gif)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[contenthash].[ext]',
					outputPath: 'assets/',
					publicPath: 'assets/',
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader?url=false'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
	devServer: {
		hot: true,
		open: 'Google Chrome',
		port: 4000,
	},
	stats: {
		colors: true,
	},
};
