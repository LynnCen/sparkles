import { get } from '@/common/request';
import { useEffect, useState } from 'react';

function useIndusties() {
  const [data, setData] = useState<any>([]);


  useEffect(() => {
    const getIndusties = async () => {
      // 直接调数据资源中心接口
      const data = await get('/order/selection/industries', {}, { proxyApi: '/order-center', needHint: true });
      setData(data);
    };

    getIndusties();
  }, []);

  return data;
}

export default useIndusties;
