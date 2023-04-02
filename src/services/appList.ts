import request from '@/utils/request';

export interface AppItem {
  _id: string;
  secret: string;
  type: number;
  category: string;
  name: string;
  mch_id: string;
  logo: {
    bucketId: string;
    file_type: string;
    text: string;
    height: number;
    width: number;
  };

  icon: {
    bucketId: string;
    file_type: string;
    text: string;
    height: number;
    width: number;
  };
  checked?: boolean;
  aid?: string;
}

export async function queryAppByName(name: string, type?: number): Promise<{ data: AppItem[] }> {
  return request('/oplapplet/applet/list', {
    params: { name, type, page: 1, row: 1000, status: 1 },
    method: 'GET',
  });
}
