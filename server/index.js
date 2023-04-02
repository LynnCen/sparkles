/* eslint-disable no-console */
const path = require("path");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = parseInt(process.env.PORT, 10) || 3000;
const isTest = process.env.TEST === "true";
// const isTest = false;
const env = process.env.NODE_ENV;
const isPro = env === "production";
// 是否是部署环境（部署环境用内网ip）
const isSVR = process.env.SVR === "true";
const apiUrl = (function () {
  return isTest ? "http://129.226.123.108:81" : "https://api.tmmtmm.com.tr";
})();

const proxy = {
  "/api": {
    target: apiUrl,
    // 添加 “/_” 重置掉请求路径
    pathRewrite: { "^/api/": "/" },
    changeOrigin: true,
  },
};

(async () => {
  const server = express();
  // Set up the proxy.
  if (proxy) {
    Object.keys(proxy).forEach(function (key) {
      server.use(key, createProxyMiddleware(proxy[key]));
    });
  }
  server.use(express.static("dist"));
  await server.listen(port);
  console.log(`> Ready on port ${port} [${env}]`);
})();
