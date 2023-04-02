const path = require("path");

const isDev = process.env.NODE_ENV == "development";

export default {
  extraBabelPlugins: [["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }]],
  env: {
    development: {
      extraBabelPlugins: ["dva-hmr"]
    }
  },
  define: {
    "process.env.SHHARBOR": process.env.SHHARBOR,
    "process.env.STAGE": process.env.STAGE,
    "process.env.apiHost": "http://dtcity.cn:1234/API",//isDev && process.env.STAGE  ? "http://192.168.1.118:1234/API":
    "process.env.publicPath": isDev ? "/" : "/editor/",
    // "process.env.proxyUrl": "http://zt.dtcity.cn",
    "process.env.LIZHONG": process.env.LIZHONG,
    "process.env.lizhongAPI": isDev
      ? "http://192.168.1.118:1239/API"
      : "http://192.168.0.52:1239/API",
    "process.env.lizhongProxy": isDev ? "http://218.205.102.32:81" : "http://192.168.0.52",
    "process.env.lsgyAPI": "https://lsgy_api.sisnet.cn",
    "process.env.disasterAPI": isDev
      ? "http://192.168.1.118:1238/api"
      : "http://47.96.133.22:1238/api"
  },
  disableCSSModules: false,
  ignoreMomentLocale: true,
  devtool: isDev || process.env.STAGE ? "cheap-module-eval-source-map" : "cheap-module-source-map"
  // alias: {
  //   '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js')
  // }
};
