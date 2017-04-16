const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        client : './src/client/js/client.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './js/develop')
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                loaders: ['style-loader', 'css-loader?modules', 'autoprefixer-loader', 'csso-loader']
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                autoprefixer: {
                    browsers: 'last 2 version'
                }
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
};