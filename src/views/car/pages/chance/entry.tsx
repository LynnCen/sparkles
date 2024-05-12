import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState } from 'react';
import { post } from '@/common/request';

const Chance = () => {
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams(values);
  };

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/34427
    const result: any = await post('/chancePoint/pages', params, true);
    return { dataSource: result.data, count: result?.meta?.total };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      <Filter
        onSearch={onSearch}/>
      <List
        params={params}
        loadData={loadData}/>
    </div>
  );
};

export default Chance;
