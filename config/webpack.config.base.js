import path from "path";
import config from "./index";
import webpack from "webpack";

console.log(`>>>>>> process`, process.env.env);

export default {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // loader: ['babel-loader', 'eslint-loader'],
                loader: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/,
                loader: ["babel-loader", "awesome-typescript-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.node$/,
                use: "native-ext-loader",
            },
            {
                test: /\.less$/,
                exclude: [/icomoon\/style.css$/, /icomoon\\style.css$/, /global.css$/],
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            // Note that we’ve set importLoaders: 1 on css-loader.
                            // We’re setting this because we want PostCSS to git @import statements first
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[path][name]__[local]--[hash:base64:5]",
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: (loader) => [
                                require("postcss-import")(),
                                require("postcss-cssnext")({
                                    browsers: [
                                        "last 2 Chrome versions",
                                        "last 2 Edge versions",
                                        "last 2 Safari versions",
                                        "last 2 Firefox versions",
                                    ],
                                }),
                            ],
                        },
                    },
                    "less-loader",
                ],
            },
            {
                test: /\.css$/,
                exclude: [/icomoon\/style.css$/, /icomoon\\style.css$/, /global.css$/],
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            // Note that we’ve set importLoaders: 1 on css-loader.
                            // We’re setting this because we want PostCSS to git @import statements first
                            modules: true,
                            importLoaders: 1,
                            localIdentName: "[path][name]__[local]--[hash:base64:5]",
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: (loader) => [
                                require("postcss-import")(),
                                require("postcss-cssnext")({
                                    browsers: [
                                        "last 2 Chrome versions",
                                        "last 2 Edge versions",
                                        "last 2 Safari versions",
                                        "last 2 Firefox versions",
                                    ],
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /icomoon(\/|\\)style.css$/,
                use: ["style-loader", "css-loader"],
            },
            // lightly file
            // { test: /\.(eot|woff2?|ttf|svg)$/, use: "url-loader" },
            {
                test: /global.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html/,
                loader: "html-loader",
            },
            {
                test: /\.woff(\?.*)?$/,
                loader:
                    "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/font-woff",
            },
            {
                test: /\.woff2(\?.*)?$/,
                loader:
                    "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/font-woff2",
            },
            {
                test: /\.otf(\?.*)?$/,
                loader:
                    "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=font/opentype",
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader:
                    "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=application/octet-stream",
            },
            {
                test: /\.svg(\?.*)?$/,
                loader:
                    "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000&mimetype=image/svg+xml",
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: "url-loader?prefix=fonts/&name=[path][name].[ext]&limit=40000",
            },
            {
                test: /\.(png|jpg|jpeg|gif|wav)$/,
                loader: "url-loader",
            },
            {
                test: /\.js$/,
                //loader: 'babel',
                loader: ["babel-loader"],
                exclude: /node_modules\/(?!tributejs)/,
                include: [path.join(__dirname, "node_modules/benz-amr-recorder")],
            },
        ],
    },

    output: {
        path: config.dist,
        // filename: (chunkData) => chunkData.chunk.name === '[name].js',
        filename: "[name].js",

        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: "commonjs2",
    },

    externals: {
        ThumbnailGenerator: "video-thumbnail-generator",
        "electron-screenshots": 'require("electron-screenshots")',
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts"],
        alias: {
            components: path.join(__dirname, "../src", "js/ui/components/"),
            utils: path.join(__dirname, "../src", "js/ui/utils/"),
            images: path.join(__dirname, "../src", "assets/images/"),
            fonts: path.join(__dirname, "../src", "assets/fonts/"),
            "@newSdk": path.join(__dirname, "../src", "js/newSdk"),
        },
    },
};
