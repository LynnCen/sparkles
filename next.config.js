const withLess = require("@zeit/next-less");
module.exports = withLess({
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[local]_[hash:base64:8]",
  },
  publicRuntimeConfig: {
    // 下载配置
    downloadConfig: {
      google: "https://play.google.com/store/apps/details?id=com.tmmtmm.im",
      iOS: "https://apps.apple.com/us/app/id1509896973",
      APK: "https://static.tmmtmm.com.tr/apk/TMMTMM_2.0.30.apk",
    },
    // 后端服务器
    apiDomain: {
      test: 'http://129.226.123.108:81',
      pro: 'https://api.tmmtmm.com.tr'
    }
  },
  webpack: (config, { isServer, dev }) => {
    // 添加文件hash
    config.module.rules.push({
      test: /\.(txt|jpg|png|svg|gif|ttf|eot|woff)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            context: "",
            outputPath: "static",
            publicPath: "/_next/static",
            name: "[name].[hash:6].[ext]",
          },
        },
      ],
    });
    return config;
  },
});
