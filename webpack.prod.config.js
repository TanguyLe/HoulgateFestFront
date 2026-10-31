const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: ["./src/houlgatefest.js"],
    mode: "production",
    resolve: {
        extensions: [".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                // Babel 8's preset-react emits dev-only JSX (jsxDEV) unless its env is production
                use: { loader: "babel-loader", options: { envName: "production" } },
            },
            {
                test: /\.css$/,
                exclude: [/bin/],
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
        // The pages other than the homepage, loaded when they are opened
        chunkFilename: "chunks/[name].[contenthash:8].js",
        publicPath: "/",
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "houlgatefest.min.css",
            chunkFilename: "chunks/[name].[contenthash:8].css",
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: "production",
            API_URL: null,
            HAS_STARTED: false,
            TOGETZER_IFRAME_URL: null,
            TURNSTILE_SITE_KEY: null,
        }),
    ],
};
