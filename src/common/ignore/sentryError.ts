export const ignoreErrors = [
  /您取消了请求/g, // promise取消请求
  /Request failed with status code 4/g, // promise取消请求
  /Request failed with status code 5/g, // promise取消请求
  /ResizeObserver/g, // ResizeObserver监听，不需要上报
  'ResizeObserver loop limit exceeded', // ResizeObserver监听，不需要上报
  /Cannot read properties of undefined \(reading \'Q\'\)/, // qiankun无意义报错
  /Cannot read properties of null \(reading \'removeChild\'\)/, // qiankun无意义报错
  /Cannot read property \'Q\' of undefined/, // qiankun无意义报错
  /Cannot read property \'removeChild\' of null/, // qiankun无意义报错
  /promise rejection captured/g, // UnhandledRejection无需收集
  'ChunkLoadError', // 忽略加载旧资源的报错日志
  /Loading( CSS)? chunk (.+) failed/g, // 忽略加载旧资源的报错日志（'ChunkLoadError'不能包含 CSS，所以使用下面的正则）
  /Cannot read property 'path' of undefined/g, // chunk-libs加载旧资源报错 Cannot read property 'path' of undefined
];
