var metaData = require('./config/info.json').metaData;
var HtmlWebpackPlugin = require('html-webpack-plugin'),
	HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
        title: metaData.title,
		template: __dirname + '/template/home.html',
		filename: 'index.html',
		inject: '#wrapper'
	});
 
module.exports = {  
    entry: {
        home: './react/home.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['es2015']}},
			{test: /\.css$/, loader: "style-loader!css-loader"}
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
};