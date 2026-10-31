const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
                use: [
                    MiniCssExtractPlugin.loader,
                    // Root-relative urls (the fonts) are served as they are from web/
                    {
                        loader: "css-loader",
                        options: { url: { filter: (url) => !url.startsWith("/") } },
                    },
                ],
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
        new MiniCssExtractPlugin({ filename: "houlgatefest.min.css" }),
        new ReactRefreshWebpackPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development",
            API_URL: "http://localhost:3000",
            HAS_STARTED: false,
            TOGETZER_IFRAME_URL: null,
            // Cloudflare's test site key in dev: the captcha always passes
            TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
        }),
    ],
};
