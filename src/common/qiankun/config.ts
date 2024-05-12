export const config = {
  tokenName: 'flow_token', // 组织管理子应用从cookie中读取token的键名
  clientKey: 1000110, // 接口请求时的clientKey
  applicationPrefix: '/gateway/customerFlow', // 接口请求时的应用前缀
  url: process.env.NODE_ENV === 'development' ? 'http://10.10.20.190:3001' : process.env.ORG_URL,
  basename: '/micro',
  containerName: 'micro-organization',
  isHashRouter: false
};
