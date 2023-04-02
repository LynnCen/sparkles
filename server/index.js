const path = require('path');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.PORT || 3000;
// const isTest = false;
const isTest = true;
const app = express();

const staticFolder = [path.join(__dirname, '../dist'), path.join(__dirname, '../backup')];
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

staticFolder.forEach((url) => {
  app.use(express.static(url));
});

const proxy = {
  '/api': {
    target: isTest ? 'http://129.226.123.108:8086' : 'http://129.226.123.108:8086',
    pathRewrite: { '^/api/': '/' },
    changeOrigin: true,
    proxyTimeout: 120 * 1000,
    timeout: 120 * 1000,
  },
};
//設置代理;
if (proxy) {
  Object.keys(proxy).forEach((key) => {
    app.use(key, createProxyMiddleware(proxy[key]));
  });
}

app.use(function (req, res, next) {
  // 设置所有HTTP请求的超时时间
  req.setTimeout(120 * 1000);
  // 设置所有HTTP请求的服务器响应超时时间
  res.setTimeout(120 * 1000);
  next();
});

app.get('/*', (req, res) => {
  res.send(template);
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
