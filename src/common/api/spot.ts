import { get, post } from '@/common/request/index';

export function postSpotList(params?: any) {
  return post('/spot/page', { ...params }, { isMock: false, needHint: true });
}

export function kaSpotList(params?: any) {
  return post('/spot/pageKA', { ...params }, { isMock: false, needHint: true });
}

export function similarSpotList(params?: any) {
  return get('/spot/similar', { ...params }, { isMock: false, needHint: true });
}
