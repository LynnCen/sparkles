import eventLib from './index';

/* 触发路由跳转 */
export function dispatchNavigate(path: string | number, extraData?: any) {
  eventLib.dispatch('navigate', path, extraData);
}
