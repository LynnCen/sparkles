/**
 * 备选址管理
 */
import Filter from './components/Filter';
import cs from 'classnames';
import styles from './entry.module.less';
import List from './components/List';
import { useState, useEffect } from 'react';
import { post } from '@/common/request';
import { randomString } from '@lhb/func';
import { tenantCheck } from '@/common/api/common';
// import { useSelector } from 'react-redux';

const Alternative = () => {
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

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/46115
    // https://yapi.lanhanba.com/project/353/interface/api/34463
    const url = isAsics ? '/expandShop/alternate/asics/pages' : '/expandShop/alternate/pages';
    const result: any = await post(url, params, true);
    const list = result.objectList.map((item: { name: string }) => ({
      ...item,
      id: randomString(),
    }));

    // 父子都得用name，否则店铺名称那一列显示不出来
    list.forEach((item) => {
      if (item.reports && item.reports.length) {
        item.reports.forEach((child) => {
          child.name = child.reportName;
        });
      }
    });
    return {
      dataSource: list,
      count: result.total,
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

export default Alternative;
