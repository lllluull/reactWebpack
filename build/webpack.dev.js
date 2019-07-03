const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const DevConfig  = {
    mode: 'development',      // 模式，表示dev环境
    output: {
        filename: 'bundle.js',  // 打包后文件名称
        publicPath : '/',
        path: path.resolve(__dirname, '../dist') // 打包后文件夹存放路径
    },
    performance: {
        hints: 'warning'
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        port: 8080,
        hot: true,
        open: true,
        http2: true,
        inline: true, // 启用内联模式，一段处理实时重载的脚本被插入到bundle中，并且构建消息会出现在浏览器控制台
        clientLogLevel: 'none', // 阻止打印那种搞乱七八糟的控制台信息
        overlay: {
            warnings: true,
            errors: true
        }
    },
    module: {
        rules: [
            {
                test: /.less$/,
                exclude: /node_modules/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    }, 'less-loader', 'postcss-loader']
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
        ]
    },             // 让 webpack 能够去处理那些非 JavaScript 文件
    plugins: [
        new webpack.NamedModulesPlugin(),  //用于启动HMR时可以显示模块的相对路径
        new webpack.HotModuleReplacementPlugin(), // 开启模块热更新，热加载和模块热更新不同，热加载是整个页面刷新
        // 简化控制台输出
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
            messages: [`You application is running here http://localhost:${devServer.port}`],
            notes: [
                'Some additionnal notes to be displayed unpon successful compilation',
            ],
            },
    
            // 是否应在每次编译之间清除控制台
            clearConsole: true,
            onErrors: function(severity, errors) {
            // You can listen to errors transformed and prioritized by the plugin
            // severity can be 'error' or 'warning'
            },
    
            // 添加格式化程序和转换器（见下文）
            additionalFormatters: [],
            additionalTransformers: [],
        }),
        ]         
    
    
}


module.exports = merge.smart(commonConfig, DevConfig)