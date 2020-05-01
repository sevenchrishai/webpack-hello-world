// 生产环境主要实现的是压缩代码、提取css文件、合理的sourceMap、分割代码
// 需要安装以下模块:
// npm i -D  webpack-merge copy-webpack-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin
// webpack-merge 合并配置
// copy-webpack-plugin 拷贝静态资源
// optimize-css-assets-webpack-plugin 压缩css
// uglifyjs-webpack-plugin 压缩js
// webpack mode设置production的时候会自动压缩js代码。原则上不需要引入uglifyjs-webpack-plugin进行重复工作。
// 但是optimize-css-assets-webpack-plugin压缩css的同时会破坏原有的js压缩，所以这里我们引入uglifyjs进行压缩
const path = require('path')
const WebpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = WebpackMerge(WebpackConfig,{
    mode:'production',    // 开发模式,development,production
    devtool:'cheap-module-source-map',
    plugins:[
        new CopyWebpackPlugin([{
            from:path.resolve(__dirname,'public'),
            to:path.resolve(__dirname,'dist')
        }]),
    ],
    optimization:{
        minimizer:[
            new UglifyJsPlugin({//压缩js
                cache:true,
                parallel:true,
                sourceMap:true
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks:{
            chunks:'all',
            cacheGroups:{
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
})