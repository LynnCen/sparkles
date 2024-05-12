import 'core-js/es';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { getScript } from '@/common/utils/get-script';
import { getCss } from '@/common/utils/get-css';
import { AliveScope } from 'react-activation';
import { ConfigProvider } from 'antd';
import store from '@/store/store';
import { Provider } from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';
import App from './app';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { ignoreErrors } from './common/ignore/sentryError';
import 'dayjs/locale/zh-cn';
import './global.less';
import { setCookie } from '@lhb/cache';

dayjs.locale('zh-cn');
// TODO: window上挂在的自定义方法都带上$前缀
window.getScript = getScript;
window.getCss = getCss;
// 接入sentry，预演、线上化环境接入
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: ['localhost', 'my-site-url.com', /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // 忽略无意义的错误
    ignoreErrors,
  });
}
if (process.env.NODE_ENV !== 'development') {
  // 该租户 id 为埋点使用，saas 后台只有 linhuiba 租户，写死就好了
  setCookie('saas_tenant_id', '1165');
  window.LHBbigdata.init({
    isSpa: true,
    cha_type: 'saas-manage',
    // 在cookie或者localstorage里抓取对应的参数放入到外层数据里
    // extendOuterConfig: ['token', 'user_id'],
    extendOuterConfig: [{ // 根据抓取的目标参数命名不同，上报数据等同于上面
      key: 'token',
      target: 'kunlun_token'
    }, {
      key: 'user_id',
      target: 'kunlun_user_id'
    },
    {
      key: 'tenant_id',
      target: 'saas_tenant_id'
    },],
    // 在cookie或者localstorage里抓取对应的参数放入到msg数据里
    // extendMsgConfig: ['enterprise_id'],
    si: 'pc',

    sendFunc: function(params, config) {
      try {
        window.LHBbigdata.xhrTool.send(process.env.NODE_TYPE === 'pe' ? config.logPathPro : config.logPathPre, params);
      } catch (err) {
        console.log(err);
      }
    },
  });
  // 线上环境不再提示接口请求被取消
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message.indexOf('您取消了请求') > -1) {
      event.preventDefault();
    }
  });
} else {
  // 本地开发环境过滤 ResizeObserver loop limit exceeded 报错
  window.addEventListener('error', (err) => {
    try {
      if (err.type === 'error') {
        // 微应用需要设置 (container || document)
        const iframe: any = document.querySelector('#webpack-dev-server-client-overlay');
        if (err.message.indexOf('ResizeObserver loop limit exceeded') > -1 || err.message.indexOf('ResizeObserver loop completed with undelivered notifications') > -1) {
          iframe.contentWindow.document.querySelector('#webpack-dev-server-client-overlay-div button').click();
        }
      }
    } catch (_) {}
  });
}
const rootElement = document.getElementById('root')!;
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<BrowserRouter>
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <AliveScope> <App /></AliveScope>
    </ConfigProvider>
  </Provider>
</BrowserRouter>);
