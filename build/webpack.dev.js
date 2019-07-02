const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports  = {
    mode: 'development',      // 模式，表示dev环境
    entry: './src/index.js',  // 入口文件
    output: {
        filename: 'bundle.js',  // 打包后文件名称
        path: path.resolve(__dirname, '../dist') // 打包后文件夹存放路径
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        port: 8080,
        hot: true,
        open: true
    },
    module: {
        rules: [{
            test: /\.(js|mjs|jsx)$/,
            exclude: /node_modules/, // 排除node_modules中的代码
            use: [{
                loader: 'babel-loader'
            }],
        }]
    },             // 让 webpack 能够去处理那些非 JavaScript 文件
    plugins: [
        new HtmlWebpackPlugin({   // 向dist文件中自动添加模版html
            template: 'src/index.html',
        }),
        new CleanWebpackPlugin(), // 打包后先清除dist文件，先于HtmlWebpackPlugin运行
    ]              // 插件
    
}