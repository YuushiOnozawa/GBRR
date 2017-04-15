const path = require('path');

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
                loaders: ['style-loader', 'css-loader?modules']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};