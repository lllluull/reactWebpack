import { resolve, join } from "path";
import { NamedModulesPlugin, HotModuleReplacementPlugin } from "webpack";
import { smart } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";

const port = 8080;

const DevConfig = {
    mode: "development", // 模式，表示dev环境
    output: {
        filename: 'bundle.js',  // 打包后文件名称
        publicPath : '/',
        path: resolve(__dirname, '../dist') // 打包后文件夹存放路径
    },
    devServer: {
        contentBase: join(__dirname, '../dist'),
        port,
        hot: true,
        open: true,
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
                test: /\.js$/,
                use:[{loader:'eslint-loader',
                    options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                        formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
                        fix: true
                    }
                }],
                enforce: "pre", // 编译前检查
                exclude: /node_modules/, // 不检测的文件
                include: [resolve(__dirname, 'src')], // 指定检查的目录
            },
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
        new NamedModulesPlugin(),  //用于启动HMR时可以显示模块的相对路径
        new HotModuleReplacementPlugin(), // 开启模块热更新，热加载和模块热更新不同，热加载是整个页面刷新
        // 简化控制台输出
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
            messages: [`You application is running here http://localhost:${port}`],
            notes: [
                '你真的很棒继续加油！！！！！！！！！！！！',
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


export default smart(commonConfig, DevConfig)