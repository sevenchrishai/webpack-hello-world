// 开发环境主要实现的是热更新,不要压缩代码，完整的sourceMap
const Webpack = require("webpack")
const WebpackMerge = require("webpack-merge")
const WebpackConfig = require("./webpack.config")

module.exports = WebpackMerge(WebpackConfig, {
    mode: "development",    // 开发模式,development,production；不设置默认是production
    devtool: "cheap-module-eval-source-map",
    devServer: {
        port: 7777,
        hot: true,
    },
    plugins:[
        new Webpack.HotModuleReplacementPlugin()    // 配置webpack-dev-server进行热更新, npm i -D webpack-dev-server
    ]
})
