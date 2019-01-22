const nodeExternals = require('webpack-node-externals');
const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        library: 'macro-execution',
        filename: '[name].min.js',
        path: path.join(__dirname, "dist"),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    entry: {macrodownload: "./src/index.ts"},
    resolve: {
        extensions: [".ts"]
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    /node_modules/
                ]
            }
        ]
    },
    externals: [nodeExternals(), '../config'],
    devtool: "source-map",
    plugins: [
       // new CleanWebpackPlugin(['dist']),
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {drop_console: true}
            }
        })
    ]
};
