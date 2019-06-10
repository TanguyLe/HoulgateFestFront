let webpack = require("webpack");

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: ["babel-polyfill", "./src/houlgatefest.js"],
	resolve: {
		extensions: [".js", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.(jsx|js)?$/,
				exclude: /node_modules/,
				use: "babel-loader?presets[]=react"
			},
			{
				test: /\.css$/,
				exclude: [/node_modules/, /bin/],
				use: ["style-loader", "css-loader"]
			}
		]
	},
	output: {
		path: __dirname + "/web",
		filename: "houlgatefest.min.js"
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			},
            "API_URL": "\"http://houlgatefest.fr\""
		}),
		new UglifyJsPlugin()
	]
};
