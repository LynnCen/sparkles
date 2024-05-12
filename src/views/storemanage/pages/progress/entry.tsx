/**
 * 拓店进展统计
 */
import Filter from './components/Filter';
import cs from 'classnames';
import List from './components/List';
import { useState, useEffect } from 'react';
import { post } from '@/common/request';
import styles from './entry.module.less';
import { randomString } from '@lhb/func';
import { tenantCheck } from '@/common/api/common';
// import { useSelector } from 'react-redux';

const Progress = () => {
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams(values);
  };
  // const isAsics = useSelector((state: any) => state.common.tenantCheck.isAsics);
  const [isAsics, setIsAsics] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    getTargetTenent();
  }, []);

  const getTargetTenent = () => {
    tenantCheck().then(({ isAsics }) => {
      setIsAsics(isAsics);
    }).finally(() => {
      setIsLoaded(true);
    });
  };

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/46143
    const apiUrl = isAsics ? '/expandShop/asics/task/progressStatistics' : '/expandShop/task/progressStatistics';
    // https://yapi.lanhanba.com/project/353/interface/api/34465
    const result: any = await post(apiUrl, params, true);
    const list = result.data.map((item: { name: string }) => ({
      ...item,
      id: randomString(),
    }));

    return {
      dataSource: list,
      count: result?.meta?.total,
    };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      {
        isLoaded ? (<>
          <Filter
            onSearch={onSearch}
            params={params}
            isAsics={isAsics}/>
          <List params={params} loadData={loadData} />
        </>) : null
      }
    </div>
  );
};

export default Progress;
