import request from '@/utils/request';

interface Statistics {
  gender?: number; // 1-男 2-女
  types?: string;
  chat_type?: number;
  start_time?: number; // 开始时间时间戳-毫秒
  end_time?: number; // 结束时间时间戳-毫秒
}

// 活跃人数
export async function queryUserCount(params?: Statistics) {
  return request('/im/statistics/activeuser', {
    params,
    method: 'GET',
  });
}
// 活跃群数
export async function queryGroupCount(params?: Statistics) {
  return request('/im/statistics/activegroup', {
    params,
    method: 'GET',
  });
}
// 今日总消息
export async function queryMessage(params?: Statistics) {
  return request('/im/statistics/msgbytypes', {
    params,
    method: 'GET',
  });
}
// 人数
export async function queryTotalUser(params?: Statistics) {
  return request('/im/statistics/usercount', {
    params,
    method: 'GET',
  });
}
// 群数
export async function queryTotalGroup(params?: Statistics) {
  return request('/im/statistics/groupcount', {
    params,
    method: 'GET',
  });
}
// 群数
export async function queryTotalSession(params?: Statistics) {
  return request('/im/statistics/conversationcount', {
    params,
    method: 'GET',
  });
}
