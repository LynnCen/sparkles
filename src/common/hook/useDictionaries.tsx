import { get } from '@/common/request';
import { useEffect, useState } from 'react';

function useIndusties(type: string) {
  const [data, setData] = useState<any>([]);


  useEffect(() => {
    const getDictionaries = async (type: string) => {
      // 直接调数据资源中心接口
      // https://yapi.lanhanba.com/project/420/interface/api/39584
      // https://yapi.lanhanba.com/mock/420/api/order/selection/dictionaries
      const data = await get('/order/selection/dictionaries', { type }, { proxyApi: '/order-center', needCancel: false });
      const newData = data.map(item => ({ label: item.name, value: item.id }));
      setData(newData);
    };

    getDictionaries(type);
  }, [type]);

  return data;
}

export default useIndusties;
