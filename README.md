# webpack-hello-world
#### 不用vue-cli，徒手撸webpack和vue

##### 1.webpack file-loader无法打包html里img src引用的图片的解决方式
```
npm i -D html-plugin
```
###### webpack.config.js
```
{
    test: /\.html$/,    // 在html里写 img src, 引入图片用到
    use: ['html-loader']
},
{
    test: /\.(jpe?g|png|gif)$/i,    // 图片文件
    use: [
        {
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
```
###### index.html
`<img src="./assets/img/2020-2-17.jpg">`
###### style.less
```
# 目录结构
-src
    -assets
        -img
            2020-2-17.jpg
        -style
            style.less
            
.images{background: url("../img/2020-2-17.jpg");}
```