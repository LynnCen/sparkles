import { get } from '@/common/request';
import { useEffect, useState } from 'react';

/**
 *
 * @param url
 * @param data
 * @returns 接口返回的数据
 */
function useAxiosGet<T, V>(url: string, data: T): V {
  const [result, setResult] = useState<V | Record<string, any>>({});

  // 获取接口返回的数据
  const getResult = async (url: string, paramas) => {
    const result = await get(url, paramas, true).catch(err => console.error(err));
    setResult(result);
  };

  useEffect(() => {
    getResult(url, data);
  }, [url, data]);

  return result as V;
};

export default useAxiosGet;
