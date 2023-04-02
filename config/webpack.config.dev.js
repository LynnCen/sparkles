import webpack from "webpack";
import config from "./index";
import baseConfig from "./webpack.config.base";
// import TerserWebpackPlugin from "terser-webpack-plugin";

const { host, port } = config.server;

// 实例化TerserWebpackPlugin对象
// const terserPlugin = new TerserWebpackPlugin({
//     extractComments: false,
//     terserOptions: {
//         format: {
//             comments: false,
//         },
//         compress: {
//             warnings: false,
//             drop_console: true,
//             drop_debugger: true,
//             pure_funcs: ["console.log"], //移除console
//         },
//     },
// });

export default {
    ...baseConfig,

    mode: "development",
    // mode: "production",
    devtool: "cheap-module-eval-source-map",

    // entry: [
    //     `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
    //     'babel-polyfill',
    //     // `${config.client}/store.js`,
    // ].concat(config.client.map(item => `${item}/store.js`)),

    // entry: {
    //     bundle: [`webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`, 'babel-polyfill'],
    //     main: `${config.client[0]}/store.js`,
    //     tray: `${config.client[1]}/store.js`
    // },

    entry: Object.assign(
        {
            bundle: [
                `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
                "babel-polyfill",
            ],
        },
        config.client
    ),

    output: {
        ...baseConfig.output,
        publicPath: `http://${host}:${port}/dist/`,
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: "commons",
    //                 chunks: "initial",
    //                 minChunks: 2,
    //             },
    //         },
    //     },
    // },
    /*  optimization: {
        // 分割代码块
        splitChunks: {
            cacheGroups: {
                //公用模块抽离
                common: {
                    name: "common",
                    chunks: "initial",
                    minSize: 0, //大于0个字节
                    minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                },

                //第三方库抽离
                vendor: {
                    name: "vendor",
                    priority: 1, //权重
                    test: /node_modules/,
                    chunks: "initial",
                    minSize: 0, //大于0个字节
                    minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
                },
            },
        },
        minimize: true,
        minimizer: [terserPlugin],
    },*/

    plugins: [
        // “If you are using the CLI, the webpack process will not exit with an error code by enabling this plugin.”
        // https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
        new webpack.NoEmitOnErrorsPlugin(),

        // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
        new webpack.HotModuleReplacementPlugin(),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: "electron-renderer",
};
