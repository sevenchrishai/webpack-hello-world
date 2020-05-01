const path = require("path")    // path 处理文件路径
/**
 * 插件：为设置的入口html自动加上打包好的output设置的js
 * <script src="main.12a27db5.js"></script>
 * @type {HtmlWebpackPlugin}
 */
const HtmlWebPackPlugin = require("html-webpack-plugin")
/**
 * 插件：打包前清空文件夹
 */
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
/**
 * 拆分css，用外链的方式引入；
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
/**
 * vue-loader 用于解析.vue文件
 * @type {VueLoaderPlugin}
 */
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const Webpack = require("webpack")

module.exports = {
    mode: "development",    // 开发模式,development,production
    entry: [    // 入口文件
        '@babel/polyfill',  // @babel/polyfill 会转义新API(promise、Generator、Set、Maps、Proxy等)
        path.resolve(__dirname, 'src/js/index.js')  // 单入口文件（默认入口文件）
        // 如果要设置多入口文件
        // main: path.resolve(__dirname, 'src/js/main.js'),
        // header: path.resolve(__dirname, 'src/js/header.js')
    ],
    output: {
        filename: "[name].[hash:8].js", // 打包后的文件名称，hash值为了解决缓存，如不设置name默认是 main.js
        path: path.resolve(__dirname, 'dist')   // 打包后的目录
    },
    devServer: {
        port: 7777,
        hot: true,
    },
    plugins: [
        new HtmlWebPackPlugin({ // 为设置的入口html自动加上打包好的js
            template: path.resolve(__dirname, 'src/index.html')  // index.html自动加上打包好的main.js
        }),
        // new HtmlWebPackPlugin({  // 如果有多个入口文件
        //     template: path.resolve(__dirname, 'src/header.html'),
        //     filename: 'header.html',
        //     chunks: ['header']  // 与入口文件entry对应的名称
        // }),
        new CleanWebpackPlugin(),   //打包自动清除上次build生成
        new MiniCssExtractPlugin({  // 拆分css，用外链的方式引入；
            // 类似 output 里面的配置
            filename: '[name].[hash].css',
            chunkFilename: '[id].css'
        }),
        new VueLoaderPlugin(),  // vue-loader 解析vue文件
        new Webpack.HotModuleReplacementPlugin(),   // 配置webpack-dev-server进行热更新, npm i -D webpack-dev-server
    ],
    module: {
        rules: [
            {
                // test 正则表达式， $ 表示匹配字符串的末尾位置，\ 转义符
                test: /\.js$/,  // npm i babel-loader @babel/preset-env @babel/core 为了使js兼容更多环境，
                use: {
                    loader: "babel-loader", // 用babel转义js文件，会将ES6/7/8转换成ES5语法，但是新的API需要借助 babel-polyfill 来转换
                    options:  {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/, // 需要loader解析我们的css;    npm i -D style-loader css-loader
                use: [ 'style-loader', 'css-loader',{
                    loader: "postcss-loader",   // npm i -D postcss-loader autoprefixer
                    options: {
                        plugins: [require('autoprefixer')]  //为css添加浏览器前缀；
                        // 另一种写法：在项目根目录创建postcss.config.js文件，
                        // module.exports = {
                        //     plugins: [require('autoprefixer')]  // 引用该插件即可了
                        // }
                    }
                }]// 从右向左解析原则
            },
            {
                test: /\.less$/,    // 如果使用less,需要 npm i -D less less-loader
                use: [
                    // MiniCssExtractPlugin.loader, // 拆分css，用外链的方式引入；一般是生产环境中用到
                    'style-loader','css-loader',{
                        loader: "postcss-loader",   // npm i -D postcss-loader autoprefixer
                        options: {
                            plugins: [require('autoprefixer')]  //为css添加浏览器前缀；
                            // 另一种写法：在项目根目录创建postcss.config.js文件，
                            // module.exports = {
                            //     plugins: [require('autoprefixer')]  // 引用该插件即可了
                            // }
                        }
                    },'less-loader'
                ]// 从右向左解析原则
            },
            {
                test: /\.html$/,    // 在html里写 img src, 引入图片用到
                use: ['html-loader']
            },
            {
                test: /\.(jpe?g|png|gif)$/i,    // 图片文件
                use: [
                    {
                        /**
                         * file-loader 将文件在进行一些处理后（主要是处理文件名和路径、解析文件url），并将文件移动到输出的目录中
                         * url-loader 一般和 file-loader 搭配使用
                         * 如果文件小于限制的大小,则会返回 base64 编码，
                         * 否则使用 file-loader 将文件移动到输出的目录中
                         * css 里的图片会解析
                         * ? html img src 不解析，如果要在 html 使用img src引入图片的话，用 html-loader 吧 ?
                         */
                        loader: "url-loader",
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'   //
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,  // 媒体文件
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,    // 字体
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    },
    resolve: {
        alias: {    // 创建 import 或 require 的别名
            'vue$': 'vue/dist/vue.runtime.esm.js',  // 末尾添加 $，以表示精准匹配
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['*', '.js', '.json', '.vue']   // 自动解析确定的扩展，能够使用户在引入模块时不带扩展：import File from '../path/to/file'
        // 默认值为：[".js", ".json"]
    }
}