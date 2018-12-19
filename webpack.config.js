const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'dev';

module.exports = {
    entry: './src/index',
    target: 'node',
    mode: env === 'production' ? 'production' : 'development',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
        ]
    },
};
