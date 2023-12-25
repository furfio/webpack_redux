// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const isDev = argv.mode === "development"
    if (isDev) {
        console.log("development mode")
    } else {
        console.log("production mode")
    }
    const config = {
        mode: isDev ? "development" : "production",
        //开发模式：cheap-module-source-mapb 优点：打包编译速度快，只包含行映射 缺点：没有列映射
        //生产模式：source-map 优点：包含行/列映射（因为生产模式下代码会被压缩为一行，没有代码列信息的话，比较难debug） 缺点：打包编译速度更慢
        devtool: isDev ? "cheap-module-source-map" : "source-map",
        // 相对路径和绝对路径都行, 注意这里的相对指的是针对根目录而言，不是当前的配置文件
        entry: "./src/main.tsx",
        output: {
            // path: 文件输出目录，必须是绝对路径
            // path.resolve()方法返回一个绝对路径
            // __dirname 当前文件的文件夹绝对路径
            path: path.resolve(__dirname, "./dist"),//除js文件之外其他文件的根目录
            // filename: 输出JS文件名
            // [contenthash:8]使用contenthash，取8位长度
            filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
            chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 除入口文件之外，其他文件输出资源命名方式
            assetModuleFilename: "static/media/[name].[hash][ext]", // 图片、字体等资源命名方式（注意用hash）
            clean: true, // 自动将上次打包目录资源清空，因为打包不能删除之前没用的文件（webpack5中支持）
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    // use 数组里面 Loader 执行顺序是从右到左， loader：只能使用一个loader，use: 可以使用多个loader
                    use: [
                        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                        // "style-loader"将js中的css通过创建style标签添加到HTML中生效
                        "css-loader" //将css资源编译成commonjs的模块到js中
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp)$/,
                    type: "asset",
                },
                // 配置babel，可以把es6的代码翻译为es5，保证兼容性。（翻译结果：dist中）
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/, // 排除node_modules代码不编译
                    use: ["babel-loader"],
                    //下面的配置挪到babel.config中
                    // options: {
                    //     presets: ["@babel/preset-env"],
                    // }
                },
                // `ts` and `tsx` files are parsed using `ts-loader`
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: "ts-loader"
                }
            ],
        },
        resolve: {
            // 从左到右优先级，自动解析文件后缀名
            extensions: ['.tsx', '.ts', '.js', '.json'],
        },
        plugins: [
            new ESLintWebpackPlugin({
                // 指定检查文件的根目录
                context: path.resolve(__dirname, "./src"),
                exclude: "node_modules", // 默认值
                cache: true, // 开启缓存
                // 缓存目录
                cacheLocation: path.resolve(
                    __dirname,
                    "./node_modules/.cache/.eslintcache"
                ),
            }),
            new HtmlWebpackPlugin({
                // 以 public/index.html 为模板创建文件
                // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
                template: path.resolve(__dirname, "./public/index.html"),
            }),
            // 提取css成单独文件
            new MiniCssExtractPlugin({
                // 定义输出文件名和目录
                filename: "static/css/[name].css",
                chunkFilename: "static/css/[name].chunk.css",
            }),
        ],
        // 开发服务器,only in dev mode
        devServer: {
            host: "localhost", // 启动服务器域名
            port: "3000", // 启动服务器端口号
            open: true, // 是否自动打开浏览器
        },
        optimization: {
            // 是否需要进行压缩
            minimize: !isDev,
            minimizer: [
                // css压缩也可以写到optimization.minimizer里面，效果一样的
                new CssMinimizerPlugin(),
            ],
            splitChunks: {
                chunks: "all",
                // 其他内容用默认配置即可,
            },
            // 将 hash 值单独保管在一个 runtime 文件中。我们最终输出三个文件：main、math、runtime。main引用了math，并且记录了math文件的hash
            // 当 math 文件发送变化，变化的是 math 和 runtime 文件，main 不变。 runtime 文件只保存文件的 hash 值和它们与文件关系，整个文件体积就比较小
            runtimeChunk: {
                name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
            },
        },
    }
    return config;
};