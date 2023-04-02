import MinifyPlugin from "babel-minify-webpack-plugin";
import config from "./index";
import baseConfig from "./webpack.config.base";
import TerserWebpackPlugin from "terser-webpack-plugin";
import webpack from "webpack";

export default {
    ...baseConfig,

    mode: "production",
    devtool: false,

    entry: ["babel-polyfill", `./main.js`],

    output: {
        path: config.dist,
        filename: "main.js",
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                // parallel: true,
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                    compress: {
                        warnings: false,
                        // drop_console: true,
                        drop_debugger: true,
                        // pure_funcs: ["console.log"], // remove console
                    },
                },
            }),
        ],
    },
    plugins: [
        // Minify the output
        new webpack.DefinePlugin({
            "process.env.env": JSON.stringify(process.env.env),
            "process.env.debug": JSON.stringify(process.env.debug),
        }),
        // new MinifyPlugin()
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: "electron-main",

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false,
    },
};
