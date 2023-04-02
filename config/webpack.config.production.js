import path from "path";
import webpack from "webpack";
import config from "./index";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import baseConfig from "./webpack.config.base";
import TerserWebpackPlugin from "terser-webpack-plugin";

const IS_DEV = !["production", "beta"].includes(process.env.env);

export default {
    ...baseConfig,

    // mode: IS_DEV ? "development" : "production",
    // devtool: IS_DEV ? "cheap-module-eval-source-map" : false,
    mode: "production",
    devtool: false,

    entry: Object.assign(
        {
            bundle: "babel-polyfill",
        },
        config.client
    ),

    output: {
        path: config.dist,
        filename: "app.[name].js",
    },
    optimization: {
        // split code chunk
        splitChunks: {
            cacheGroups: {
                // common module
                common: {
                    name: "common",
                    chunks: "initial",
                    minSize: 0, // over than 0 byte
                    minChunks: 2, // import time
                },

                //three part of library
                // vendor: {
                //     name: "vendor",
                //     priority: 1, // weight
                //     test: /node_modules/,
                //     chunks: "initial",
                //     minSize: 0, // over than 0 byte
                //     minChunks: 2, // import time
                // },
            },
        },
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
        // https://github.com/webpack/webpack/issues/2545
        // Use babel-minify-webpack-plugin minify code
        // new MinifyPlugin(),

        // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // https://github.com/webpack/webpack/issues/864
        new webpack.optimize.OccurrenceOrderPlugin(),

        new CopyWebpackPlugin([
            {
                from: `${config.assets}/fonts/**/*`,
                to: `${config.dist}/src`,
            },
            {
                from: `${config.assets}/images/**/*`,
                to: config.dist,
            },
            {
                from: `${config.assets}/tmm_emoji/**/*`,
                to: config.dist,
            },
            {
                from: `${config.root}/src/otherRenderProcess/**/*`,
                to: config.dist,
            },
            // {
            //     from: `${config.assets}/twemoji/**/*`,
            //     to: config.dist,
            // },
            {
                from: path.resolve(__dirname, "../package.json"),
                to: config.dist,
            },
            {
                from: path.resolve(__dirname, "../tmmDefaultSource/**/*"),
                to: config.dist,
            },
            {
                from: path.resolve(__dirname, "../locales/*"),
                to: config.dist,
            },
        ]),
        new webpack.DefinePlugin({
            "process.env.env": JSON.stringify(process.env.env),
        }),
        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/index.html`,
            template: "./src/index.html",
            inject: "body",
            chunks: ["bundle", "common", "main"],
            hash: true,
            minify: {
                collapseWhitespace: true,
            },
        }),
        new HtmlWebpackPlugin({
            filename: `${config.dist}/src/lightlyWindow/LightBox/index.html`,
            template: "./src/lightlyWindow/LightBox/index.html",
            inject: "body",
            chunks: ["bundle", "common", "lightBox"],
            hash: true,
            minify: {
                collapseWhitespace: true,
            },
        }),
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: "electron-renderer",
};
