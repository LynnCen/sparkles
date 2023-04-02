/* eslint-disable no-console */
const path = require("path");
const express = require("express");
const next = require("next");
const proxyMiddleware = require("http-proxy-middleware");
const nextI18NextMiddleware = require('next-i18next/middleware').default
const nextI18next = require('../i18n')
const sitemap = require("./sitemap");

const port = parseInt(process.env.PORT, 10) || 3000;
const isTest = process.env.TEST === "true";
// const isTest = false;
const env = process.env.NODE_ENV;
const isPro = env === "production";
// 是否是部署环境（部署环境用内网ip）
const isSVR = process.env.SVR === "true";
const apiUrl = (function () {
  return isTest
    ? "http://129.226.123.108:81"
    : "https://api.tmmtmm.com.tr";
})();
process.env.apiUrl = apiUrl;
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev: !isPro
});

const proxy = {
  "/api": {
    target: apiUrl,
    // 添加 “/_” 重置掉请求路径
    pathRewrite: { "^/api/": "/" },
    changeOrigin: true
  }
};

const handle = app.getRequestHandler();

(async () => {
  await app.prepare()
  const server = express();
  // Set up the proxy.
  if (proxy) {
    Object.keys(proxy).forEach(function (context) {
      server.use(proxyMiddleware(context, proxy[context]));
    });
  }
  sitemap({ server });
  await nextI18next.initPromise
  server.use(nextI18NextMiddleware(nextI18next))
  server.all("*", (req, res) => handle(req, res));
  await server.listen(port);
  console.log(`> Ready on port ${port} [${env}]`);
})()
// let server;
// app
//   .prepare()
//   .then(() => {
//     server = express();
//     // Set up the proxy.
//     if (proxy) {
//       Object.keys(proxy).forEach(function(context) {
//         server.use(proxyMiddleware(context, proxy[context]));
//       });
//     }
//     // Set up the i18n
//     server.use(nextI18NextMiddleware(nextI18next))
//     sitemap({ server });

//     // Default catch-all handler to allow Next.js to handle all other routes
//     server.all("*", (req, res) => handle(req, res));

//     server.listen(port, err => {
//       if (err) {
//         throw err;
//       }
//       console.log(`> Ready on port ${port} [${env}]`);
//     });
//   })
//   .catch(err => {
//     console.log("An error occurred, unable to start the server");
//     console.log(err);
//   });
