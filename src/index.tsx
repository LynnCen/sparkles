import 'core-js/es';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { getScript } from '@/common/utils/get-script';
import { getCss } from '@/common/utils/get-css';
import { ConfigProvider } from 'antd';
import store from '@/store/store';
import { Provider } from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';
import App from './app';
import dayjs from 'dayjs';
import { AliveScope } from 'react-activation';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import 'dayjs/locale/zh-cn';
import './global.less';
import { ignoreErrors } from './common/ignore/sentryError';
import { ErrorBoundary } from 'react-error-boundary';

dayjs.locale('zh-cn');
/** react-activation 对 Context 的破坏性影响
 * https://github.com/CJY0208/react-activation/blob/master/README_CN.md
 * 如果run serve报错，查看 https://github.com/react-dnd/react-dnd/issues/3423
 */
import { autoFixContext } from 'react-activation';
import { aMapServiceHost, aMapServiceHostDev } from './common/utils/map';
import V2Empty from '@/common/components/Data/V2Empty';
autoFixContext(
  [require('react/jsx-runtime'), 'jsx', 'jsxs', 'jsxDEV'],
  [require('react/jsx-dev-runtime'), 'jsx', 'jsxs', 'jsxDEV']
);
// qiankun
// import start from '@/common/qiankun';

// 当npm run serve 不带环境时，NODE_TYPE为local
const serviceHost = (process.env.NODE_TYPE === 'local' || process.env.NODE_TYPE === 'ie' || process.env.NODE_TYPE === 'te') ? aMapServiceHostDev : aMapServiceHost;

window.getScript = getScript;
window.getCss = getCss;
// https://lbs.amap.com/api/javascript-api-v2/guide/abc/load
window._AMapSecurityConfig = {
  serviceHost,
};

// 接入sentry，预演、线上环境接入
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
// 本地测试完成后，记得通过NODE_ENV判断将 本地启动环境屏蔽
if (process.env.NODE_ENV !== 'development') {
  window.LHBbigdata.init({
    isSpa: true,
    cha_type: 'location-pc',
    // 在cookie或者localstorage里抓取对应的参数放入到外层数据里
    extendOuterConfig: [{ // 根据抓取的目标参数命名不同，上报数据等同于上面
      key: 'token',
      target: 'flow_token',
    }, {
      key: 'user_id',
      target: 'employeeId'
    }, {
      key: 'tenant_id',
      target: 'tenantId'
    }
    ],
    si: 'pc',
    sendFunc: function(params, config) {
      try {
        window.LHBbigdata.xhrTool.send(process.env.NODE_TYPE === 'pe' ? config.logPathPro : config.logPathPre, params);
      } catch (err) {}
    }
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
const fallbackRender = ({
  error
}) => {
  return <div style={{ width: '100%', height: '100%' }}>
    <V2Empty centerInBlock customTip={`前方正在施工中~${error}`}/>
  </div>;
};

ReactDOM.render(
  <ErrorBoundary
    fallbackRender={fallbackRender}
  >
    <BrowserRouter>
      <AliveScope>
        <Provider store={store}>
          <ConfigProvider locale={zhCN}>
            <App />
          </ConfigProvider>
        </Provider>
      </AliveScope>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById('root')
);

// 启动 qiankun
// start();


