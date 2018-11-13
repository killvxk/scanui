const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'i' + package.version,
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        new CopyWebpackPlugin([], {
            ignore: []
        })
    ],
    //设置跨域代理
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        host: '0.0.0.0',
        port: 8314,
        proxy: {
            '/api.php': {
              target: 'http://127.0.0.1:8315',
              pathRewrite: {'^/api.php' : '/api.php'},
              changeOrigin: true
            },
            '/upload.php': {
              target: 'http://127.0.0.1:8315',
              pathRewrite: {'^/upload.php' : '/upload.php'},
              changeOrigin: true
            },
            '/report.php': {
              target: 'http://127.0.0.1:8315',
              pathRewrite: {'^/report.php' : '/report.php'},
              changeOrigin: true
            }
        }
    },
});