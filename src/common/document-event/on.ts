import eventLib from './index';
/* 监听是否展示全局loading */
export function onLoading(callback) {
  eventLib.on('loading', callback);
}

/* 监听navigate方法 */
export function onNavigate(callback) {
  eventLib.on('navigate', callback);
}

/* 监听登录操作 */
export function onLogin(callback) {
  eventLib.on('login', callback);
}
