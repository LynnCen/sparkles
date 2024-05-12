/**
 * 明细报表
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState, useEffect } from 'react';
import { post } from '@/common/request';
import { tenantCheck } from '@/common/api/common';
// import { useSelector } from 'react-redux';

const Report = () => {
  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams(values);
  };
  // const isAsics = useSelector((state: any) => state.common.tenantCheck.isAsics);
  const [isAsics, setIsAsics] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // const [isBabyCare, setIsBabyCare] = useState<boolean>(false);

  useEffect(() => {
    getTargetTenent();
  }, []);

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/46129
    const apiUrl = isAsics ? `/expandShop/detailReport/asics/pages` : `/expandShop/detailReport/pages`;
    // https://yapi.lanhanba.com/project/353/interface/api/34466
    const result: any = await post(apiUrl, params, true);
    return {
      dataSource: result.data,
      count: result?.meta?.total,
    };
  };

  const getTargetTenent = () => {
    tenantCheck().then(({ isAsics }) => {
      setIsAsics(isAsics);
    }).finally(() => {
      setIsLoaded(true);
    });
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      {
        isLoaded ? (<>
          <Filter
            onSearch={onSearch}
            params={params}
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

export default Report;
