const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
    entry: ["./src/houlgatefest.js"],
    mode: "development",
    resolve: {
        extensions: [".js", ".jsx"],
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /(node_modules|bin)/,
                use: { loader: "babel-loader", options: { plugins: ["react-refresh/babel"] } },
            },
            {
                test: /\.css$/,
                exclude: /bin/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/web",
        filename: "houlgatefest.min.js",
    },
    devServer: {
        static: "./web",
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development",
            API_URL: "http://localhost:3000",
            HAS_STARTED: false,
            SCORES_BOARD_URL: null,
            TOGETZER_IFRAME_URL: null,
            // Cloudflare's test site key in dev: the captcha always passes
            TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
        }),
    ],
};
