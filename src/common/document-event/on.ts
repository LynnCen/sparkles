import eventLib from './index';

/* 监听路由跳转 */
export function onNavigate(callback) {
  eventLib.on('navigate', callback);
}
