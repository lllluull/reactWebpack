const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs')

const plugins = [
    new HtmlWebpackPlugin({   // 向dist文件中自动添加模版html
        template: 'src/index.html',
    })
]
const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
files.forEach((file) => {
	if (/.*\.dll.js/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({    // 将dll.js文件自动引入html
			filepath: path.resolve(__dirname, '../dll', file),
		}));
	}
	if (/.*\.manifest.json/.test(file)) {
		plugins.push(new webpack.DllReferencePlugin({    // 当打包第三方库时，会去manifest.json文件中寻找映射关系，如果找到了那么就直接从全局变量(即打包文件)中拿过来用就行，不用再进行第三方库的分析，以此优化打包速度
			manifest: path.resolve(__dirname, '../dll', file),
		}));
	}
});



module.exports  = {
    entry: './src/index.js',  // 入口文件
    stats: {
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        moduleTrace: true,
        errorDetails: true,
        children: false
    },
    resolve: {
        extensions: ['.js', '.jsx'], // 当通过import login from './login/index'形式引入文件时，会先去寻找.js为后缀当文件，再去寻找.jsx为后缀的文件
        mainFiles: ['index', 'view'], // 如果是直接引用一个文件夹，那么回去直接找index开头的文件，如果不存在再去找view开头的文件
        alias: {   // 暂时没用到，就注释掉
            '@': path.resolve('src'), // 配置别名可以加快webpack查找模块的速度
        }
    },
    module: {
        rules: [{
            test: /\.(js|mjs|jsx)$/,
            exclude: /node_modules/, // 排除node_modules中的代码
            use: [{
                loader: 'babel-loader'
            }],
        },
        {
            test: /.(png|jpg|gif|jpeg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]', // placeholder 占位符
                    outputPath: 'images/', // 打包文件名
                    limit: 204800, // 小于200kb则打包到js文件里，大于则使用file-loader的打包方式打包到imgages里
                },
            },
        },
        {
            test: /.(eot|woff2?|ttf|svg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]-[hash:5].min.[ext]', // 和上面同理
                    outputPath: 'fonts/',
                    limit: 5000,
                }
            },
        }
    ]
    },             // 让 webpack 能够去处理那些非 JavaScript 文件
    plugins
    
}