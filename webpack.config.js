const TerserPlugin = require("terser-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
module.exports = {
    target: ['web', 'es5'],
    entry: {
        index: ['./index.js']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: "[name].js",
        // 这将在所有模块定义下暴露你的库, 允许它与 CommonJS、AMD 和作为全局变量工作
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: ['vue-style-loader',
                            'css-loader',
                            'sass-loader'],
                    },
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]',
                    esModule: false,
                    // outputPath: './assets',
                    // publicPath: './'
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 5,
                    compress: {
                        drop_console: true,
                        drop_debugger: false,
                    },
                    output: {
                        ecma: 5,
                        beautify: false, //最紧凑的输出，不保留空格和制表符
                        comments: false, //删除所有注释
                    }
                },
                extractComments: false
            })
        ],
    },
    plugins: [
        new CleanWebpackPlugin({}),
        new VueLoaderPlugin()
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
}