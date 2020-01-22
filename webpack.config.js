
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'production';

const assets = process.cwd();
var src = path.join(assets, 'src');


var plugins = [
    new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        chunks: ['example'],
        template: `${src}/example/index.html`
    })
];


module.exports={
    mode: 'development',
    entry: {
        example: `${src}/example/index.js`,
        index: `${src}/index`
    },
    output:{
        filename: '[name].js',//输出的文件名称,
        path: path.join(__dirname, 'lib')
    },
    resolve: {
        alias: {
            '~': assets,
            '@': `${src}/modules`,
            'jquery': `${src}/libs/jquery`
        }
    },
    module:{
        rules: [
            {
                test: /\.less/,
                use: [
                    {
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    },{
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.css/,
                use: [
                    {
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|bmp)/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /\.js/,
                exclude: [/node_modules/, /libs/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react','env'],
                            plugins: ["transform-runtime","syntax-object-rest-spread","transform-class-properties"]
                        }
                    }
                ]
            },
            {
                test: /\.html/,
                use: [
                    {
                        loader: 'html-withimg-loader'
                    }
                ]
            },
            {
                test: /\.md/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'markdown-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: plugins,

      devServer: {
        port: 3001,
          host: '0.0.0.0'
      }
}