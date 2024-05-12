import eventLib from './index';

/* 移除navigate监听 */
export function removeNavigate(callback) {
  eventLib.remove('navigate', callback);
}
