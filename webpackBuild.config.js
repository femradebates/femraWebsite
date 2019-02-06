const path = require('path');

module.exports = {
    entry: './src/index.ts',
    //mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
            ]},
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve:{
        extensions: [ '.tsx', '.ts', '.js' ]
    }
};