let webpack = require("webpack");

const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    entry: [
        "react-hot-loader/patch",
        "./src/houlgatefest.js"
    ],
    mode: "production",
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                use: "babel-loader"
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
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            },
            "API_URL": "\"http://houlgatefest.fr\"",
            "HAS_STARTED": false
        })
    ]
};
