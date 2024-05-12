import { FC, useState } from 'react';
import { checkSpotAnalysis } from '@/common/api/footprinting';
import styles from './index.module.less';
import Search from './components/Search';
import TableList from './components/TableList';

const Analysis: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({
    projectCode: '' // 任务码
  });
  const searchHandle = (filter?: any) => {
    setSearchParams({ ...searchParams, ...filter });
  };

  const loadData = async (params: any) => {
    const { data, meta } = await checkSpotAnalysis(params);
    return {
      dataSource: data,
      count: meta?.total
    };
  };

  return (
    <div className={styles.container}>
      <Search onSearch={(params) => searchHandle(params)}/>
      <TableList
        searchParams={searchParams}
        loadData={(params) => loadData(params)}
        updateData={() => searchHandle()}/>
    </div>
  );
};

export default Analysis;



