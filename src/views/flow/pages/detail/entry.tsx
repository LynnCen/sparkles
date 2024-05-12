import { FC, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { deviceList } from '@/common/api/flow';
import { urlParams } from '@lhb/func';
import styles from './entry.module.less';
import Table from './components/Table';

const Detail: FC<any> = () => {
  const id = urlParams(location.search)?.id || '';
  const [searchParams, setSearchParams] = useState<any>({
    isCurPage: false
  });
  // methods
  const { loadData } = useMethods({
    loadData: async (params: any) => {
      const { objectList, totalNum } = await deviceList({ storeId: id, ...params });
      return {
        dataSource: objectList || [],
        count: totalNum
      };
    },
  });

  return (
    <div className={styles.container}>
      <Table
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        loadData={loadData}/>
    </div>
  );
};

export default Detail;
