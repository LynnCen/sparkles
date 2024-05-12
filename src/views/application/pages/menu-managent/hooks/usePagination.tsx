import { useState } from 'react';

interface Pagination {
  total?: number
  current?: number
  pageSize?: number
  showTotal?: (total: number) => string
  onChange: (page: number) => void
  showSizeChanger: boolean
  showQuickJumper: boolean
  onShowSizeChange: (page: number, size: number) => void
  pageSizeOptions?: string[]
}

const usePagination = (total: number, pSize?: number, pSizeOptions?: string[], pCurrent? : number, actionCb?: any): Pagination => {
  const [current, setCurrent] = useState<number>(pCurrent || 1);
  const [pageSize, setPageSize] = useState<number>(pSize || 10);
  const maxTotal = 10000; // 最大total限制
  const borderTotal = Math.min(maxTotal, total); // 最大不得超过10000
  // 先分出多少页, 分页以后的数据是是否超出边界
  const isOvertop = (Math.ceil(borderTotal / pageSize) * pageSize) > maxTotal;
  // 如果超过边界值,需要减去超出的部分
  const fakeTotal = borderTotal - (isOvertop ? (borderTotal % pageSize) : 0); // 取真实边界值

  const showTotal = () => {
    return `共有${total}条记录，当前第${current}页`;
  };

  // 页码改变后第回调
  const onShowSizeChange = (_: number, size: number) => {
    setPageSize(size);
  };

  // pageSize 变化的回调
  const onChange = (page: number) => {
    setCurrent(page);
    actionCb?.(3);
  };

  const pagination: Pagination = {
    total: Math.abs(fakeTotal),
    current,
    pageSize,
    showTotal,
    onShowSizeChange,
    showSizeChanger: true,
    onChange,
    showQuickJumper: true,
    pageSizeOptions: pSizeOptions || ['10', '20', '50', '100'],
  };

  return pagination;
};

export default usePagination;
