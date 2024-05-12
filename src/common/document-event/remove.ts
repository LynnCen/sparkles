import eventLib from './index';
/* 移除是否展示全局loading的监听 */
export function removeLoading(callback) {
  eventLib.remove('loading', callback);
}
