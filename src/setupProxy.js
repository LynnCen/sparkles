// 跨域配置
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = process.env.NODE_TYPE;

const targetUrlObj = {
  default: 'https://loc.lanhanba.net/', // 默认
  te: 'https://loc.lanhanba.net/', //  测试
  ie: 'https://ie-console.lanhanba.net/', // 集成
  se: 'https://loc.lanhanba.com/', // 预演
  pe: 'https://loc.locxx.com/', // 生产
};

const targetUrl = targetUrlObj[env] || targetUrlObj.default;
const proxyOption = {
  target: targetUrl, // 请求接口地址
  changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
  secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
  ws: false, // websocket支持
};
module.exports = function (app) {
  app.use(
    '/terra',
    createProxyMiddleware({
      ...proxyOption
      // pathRewrite: { // /terra 不会传递到到url中
      //   '^/terra': '/'
      // }
    })
  );
  app.use(
    '/nox',
    createProxyMiddleware({
      ...proxyOption
    })
  );
  app.use(
    '/mirage',
    createProxyMiddleware({
      ...proxyOption
    })
  );
  app.use(
    '/zeus-api',
    createProxyMiddleware({
      ...proxyOption
    })
  );
};
