const webpack = require("webpack");
const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// env: { webpack:{ xxx }}
module.exports = function wp(webpackConfig, env) {
  if (process.env.NODE_ENV === "production") {
    webpackConfig.entry = {
      index: "./src/index.js"
      // share: ["./src/page/SharePage.tsx", "./src/page/SharePPT.tsx"]
    };
    webpackConfig.output = {
      filename: "compress/[name].js",
      chunkFilename: "compress/[name].async.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/editor/"
    };
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        comments: false, //去掉注释
        compress: {
          warnings: false, //去掉警告
          drop_console: !process.env.STAGE //去掉log
        }
      }),
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css|gif|otf|ttf)$/,
        threshold: 20480,
        minRatio: 0.8
      }),
      new HtmlWebpackPlugin({
        title: "数字孪生平台",
        timestamp: Date.now(),
        host: process.env.STAGE ? "192.168.1.118" : "dtcity.cn",
        filename: "index.html",
        template: "./index.ejs",
        hash: true,
        showErrors: true,
        chunksSortMode: "manual",
        chunks: ["manifest", "vendor"]
      })
    );
    // webpackConfig.plugins.push(new BundleAnalyzerPlugin()); //分析包大小等
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "compress/[name].[chunkhash:8].js",
        minChunks: function(module, count) {
          // console.log(module.resource, count);
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.includes(path.join(__dirname, "./node_modules"))
          );
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        children: true,
        async: "children-async"
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: "common",
      //   filename: "compress/[name].[chunkhash:8].js",
      //   chunks: ["index"]
      // }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        filename: "[name].js",
        chunks: Infinity
      })
    );
  }
  return webpackConfig;
};
