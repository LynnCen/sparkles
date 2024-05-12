import cs from 'classnames';
import styles from './entry.module.less';
import Filter from './components/Filter';
import List from './components/List';
import { useState, useEffect } from 'react';
import { post } from '@/common/request';
// import { useSelector } from 'react-redux';
import { tenantCheck } from '@/common/api/common';
import V2Container from '@/common/components/Data/V2Container';

const Tap = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [params, setParams] = useState<any>({});
  // const isAsics = useSelector((state: any) => state.common.tenantCheck.isAsics);
  const onSearch = (values: any) => {
    setParams(values);
  };
  const [isAsics, setIsAsics] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    getTargetTenent();
  }, []);

  const loadData = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/46255
    // https://yapi.lanhanba.com/project/353/interface/api/34427
    const url = isAsics ? '/chancePoint/asics/pages' : '/chancePoint/pages';
    const result: any = await post(url, params, true);
    return { dataSource: result.data, count: result?.meta?.total };
  };

  const getTargetTenent = () => {
    tenantCheck()
      .then(({ isAsics }) => {
        setIsAsics(isAsics);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  };

  return (
    <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
      {isLoaded ? (
        <>
          <V2Container
            style={{ height: 'calc(100vh - 120px)' }}
            emitMainHeight={(h) => setMainHeight(h)}
            extraContent={{
              top: (
                <>
                  <Filter
                    onSearch={onSearch}
                    isAsics={isAsics}
                    // isBabyCare={isBabyCare}
                  />
                </>
              ),
            }}
          >
            <List
              isAsics={isAsics}
              params={params}
              loadData={loadData}
              mainHeight={mainHeight}
              // isBabyCare={isBabyCare}
            />
          </V2Container>
        </>
      ) : null}
    </div>
  );
};

export default Tap;
