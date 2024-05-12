/**
 * 储备店管理
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState, useEffect } from 'react';
import { post } from '@/common/request';
// import { useSelector } from 'react-redux';
import { tenantCheck } from '@/common/api/common';

const Reserve = () => {
  const [params, setParams] = useState<any>({});
  // const isAsics = useSelector((state: any) => state.common.tenantCheck.isAsics);
  const onSearch = (values: any) => {
    setParams(values);
  };
  // const [isBabyCare, setIsBabyCare] = useState<boolean>(false);
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
    // https://yapi.lanhanba.com/project/353/interface/api/46157
    // https://yapi.lanhanba.com/project/353/interface/api/34464
    const url = isAsics ? '/expandShop/reserveStore/asics/pages' : '/expandShop/reserveStore/pages';
    const result: any = await post(url, params, true);
    return {
      dataSource: result.data,
      count: result?.meta?.total,
    };
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      {
        isLoaded ? (<>
          <Filter
            onSearch={onSearch}
            isAsics={isAsics}
          // isBabyCare={isBabyCare}
          />
          <List
            isAsics={isAsics}
            params={params}
            loadData={loadData}
          // isBabyCare={isBabyCare}
          />
        </>) : null
      }
    </div>
  );
};

export default Reserve;
