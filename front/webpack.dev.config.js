let webpack = require("webpack");

module.exports = {
    entry: [
            'react-hot-loader/patch',
            './src/houlgatefest.js'
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devtool: '#inline-source-map',
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: [/node_modules/, /bin/],
                use: ['react-hot-loader/webpack', 'babel-loader?presets[]=react']
            }
        ]
    },
    output: {
        path: __dirname + "/web",
        filename: "houlgatefest.min.js"
    },
    devServer: {
        contentBase: './web',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
