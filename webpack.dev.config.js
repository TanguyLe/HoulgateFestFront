let webpack = require("webpack");

module.exports = {
    entry: ["react-hot-loader/patch", "./src/houlgatefest.js"],
    mode: "development",
    resolve: {
        extensions: [".js", ".jsx"],
        alias: { "react-dom": "@hot-loader/react-dom" },
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: [/node_modules/, /bin/],
                use: ["react-hot-loader/webpack", "babel-loader"],
            },
            {
                test: /\.css$/,
                exclude: [/bin/],
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/web",
        filename: "houlgatefest.min.js",
    },
    devServer: {
        static: './web',
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development",
            API_URL: "http://localhost:3000",
            HAS_STARTED: false,
            SCORES_BOARD_URL: "https://keepthescore.co/board/kecveeapsar/",
        }),
    ],
};
