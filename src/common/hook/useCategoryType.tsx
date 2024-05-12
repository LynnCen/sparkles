import { get } from '@/common/request';
import { useEffect, useState } from 'react';

function useCategoryType(resourcesType: 0 | 1, visible?: boolean) {
  const [data, setData] = useState<any>([]);


  useEffect(() => {
    const getCategorys = async () => {
      // 直接调数据资源中心接口
      const data = await get('/category/list', { resourcesType }, { needCancel: false });
      setData(data);
    };

    if (visible === undefined || visible) {
      getCategorys();
    }

  }, [resourcesType, visible]);

  return data;
}

export default useCategoryType;
