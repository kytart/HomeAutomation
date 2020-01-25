const path = require('path');

module.exports = {
    entry: './src/client/bundle',
    output: {
        path: path.resolve(__dirname, 'dist/client'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
        ],
    },
};
