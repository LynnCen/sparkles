import eventLib from './index';
/* 操作全局loading的展示与否 */
export function dispatchLoading(data) {
  eventLib.dispatch('loading', data);
}

/* 调用router的useNavigate方法 */
export function dispatchNavigate(path: string | number, extraData?: any) {
  eventLib.dispatch('navigate', path, extraData);
}

export function dispatchLogin(data: any) {
  eventLib.dispatch('login', data);
}

