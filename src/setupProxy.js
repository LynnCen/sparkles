// 跨域配置
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = process.env.NODE_TYPE;

 const targetUrlObj = {
  default: 'https://ie-admin.lanhanba.net', // 默认
  te: 'https://admin.lanhanba.net', //  测试
  ie: 'https://ie-admin.lanhanba.net', // 集成
  se: 'https://admin.lanhanba.com', // 预演
  pe: 'https://admin.locxx.com/', // 生产
  ip: 'http://127.0.0.1', // 本模式提供给特殊情况使用，如连接本地或他人ip
};

const targetUrl = targetUrlObj[env] || targetUrlObj.default;

module.exports = function (app) {

  app.use(
    '/res',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/blaster',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
  app.use(
    '/radar',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/mirage',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/order-center',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/passenger-flow',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/wkcrm-api',
    createProxyMiddleware({
      target: targetUrl , // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/mdata-api',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );

  app.use(
    '/pms-api',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
  // 工作流引擎
  app.use(
    '/workflow-api',
    createProxyMiddleware({
      target: targetUrl , // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );


  app.use(
    '/terra-api',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
  // 交易平台lcn的服务
  app.use(
    '/lcn-api',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
  // 交易平台 商业直租的服务
  app.use(
    '/zhizu-api',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
  // 交易平台 商业直租的服务
  app.use(
    '/ob',
    createProxyMiddleware({
      target: targetUrl, // 请求接口地址
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      secure: true, // 是否验证SSL Certs.  如果是https接口，需要配置这个参数
      ws: false, // websocket支持
    })
  );
};
