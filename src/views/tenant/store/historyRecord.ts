import { get } from '@/common/request';
import { historyRecordMap } from '../pages/api';

interface Record {
  id?: number;	// 主键
  username?: string;	// 用户名
  gmtCreate?:	string; // 创建时间
  category?: string; // 操作类型
  content?: string[]; // 操作内容
}

export interface Page {
  page?: number;
  size?: number;
}

interface HistoryRecord {
  getList(tenantId: number, pagination: Page): Promise<{ list: Record[], total: number }>
}

class HistoryRecordStore implements HistoryRecord {
  async getList(tenantId: number, pagination: Page): Promise<{ list: Record[], total: number }> {
    return get(historyRecordMap.get('list'), { tenantId, ...pagination }, {
      proxyApi: '/mirage',
      needHint: true
    }) || {};
  }

};

export default new HistoryRecordStore();
