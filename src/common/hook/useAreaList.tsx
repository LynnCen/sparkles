import { get } from '@/common/request';
import { useEffect, useState } from 'react';

function useAreaList(type: number, visible?: boolean) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const getAreaList = async () => {
      // 直接调账号中心地址接口
      const data = await get('/area/list', { type }, { needCancel: false, proxyApi: '/mirage' });
      setData(data);
    };

    if (!type) {
      return;
    }

    if (visible === undefined || visible) {
      getAreaList();
    }

  }, [type, visible]);

  return data;
}

export default useAreaList;
