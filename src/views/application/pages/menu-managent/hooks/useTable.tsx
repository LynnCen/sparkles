import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { usePagination } from '.';


export type GetList = (
  pageNo: number,
  pageSize: number,
  searchParams?: any
) => Promise<any>;

const useTable = (getList: GetList, searchParams?: any, cb?: () => void) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const pagination = usePagination(total);
  const { current, pageSize } = pagination;

  // 调接口
  const getTables = async (
    current: number,
    pageSize: number,
    searchParams?: any
  ) => {
    setLoading(true);
    const result = await getList(current, pageSize, searchParams);

    if (!result) return;

    const { total = 0, list = [] } = result;
    // 批量更新
    unstable_batchedUpdates(() => {
      setTotal(total);
      setLoading(false);
      setTableData(list);

      // 用于告诉外界当前接口是否执行完毕
      cb?.();
    });
  };

  // 这个地方统一调接口数据
  useEffect(() => {
    getTables(current!, pageSize!, searchParams);
  }, [current, pageSize, searchParams]);

  return { tableData, loading, pagination };
};

export default useTable;
