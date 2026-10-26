const webpack = require("webpack");

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
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    output: {
        path: __dirname + "/web",
        filename: "houlgatefest.min.js",
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: "production",
            API_URL: null,
            HAS_STARTED: false,
            SCORES_BOARD_URL: null,
            TOGETZER_IFRAME_URL: null,
        }),
    ],
};
