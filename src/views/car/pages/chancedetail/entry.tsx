import { urlParams } from '@lhb/func';
import { Spin } from 'antd';
import { FC, useEffect, useState, useMemo } from 'react';
import BaseInfo from './components/BaseInfo';
import GradeInfo from './components/GradeInfo';
import Table from './components/Table';
import styles from './entry.module.less';
import { TabInfo, DynamicDetail } from '@/common/components/business/StoreDetail';
import Surround from '@/common/components/business/StoreDetail/components/Surround';
import { post } from '@/common/request';

const Chancedetail: FC<any> = () => {
  const id: string | number = urlParams(location.search)?.id;
  const code: string = urlParams(location.search)?.code;
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });

  useEffect(() => {
    (async () => {
      const urlMap = {
        // https://yapi.lanhanba.com/project/353/interface/api/34428
        'other': '/chancePoint/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/49447
        'dynamic': '/expandShop/dynamic/chancePoint/scoreDetail'
      };
      const detailUrl = urlMap[code];

      post(detailUrl, { id: Number(id) }, { isMock: false, mockId: 353 }).then((result) => {
        setData({ loading: false, result: result });
      });
    })();
  }, [id, code]);
  const loadData = async () => {
    return {
      dataSource: data?.result.storeList || [],
    };
  };

  /**
   * @description 是否有周边查询入口
   */
  const hasSurroundPermission = useMemo(() => {
    const { result } = data;
    return result && Array.isArray(result.permissions) && !!result.permissions.filter((item) => item.event === 'surroundReport:pcEntrance').length;
  }, [data]);

  return (
    <>
      {data.loading
        ? <Spin />
        : (
          <div className={styles.container}>
            {(code === 'other') && <>
              <BaseInfo
                result={data?.result}
              />
              {data?.result?.storeList?.length ? <Table
                data={data?.result.storeList}
                loadData={loadData}/> : <div></div>}

              <GradeInfo
                result={data.result}
              />
              <div className='mt-20'>
                {hasSurroundPermission && <Surround detail={data?.result}/>}
                <TabInfo
                  result={data.result}
                />
              </div>
            </>}
            {code === 'dynamic' && <DynamicDetail title={data.result?.chancePointName} data={data.result}/>}
          </div>)}
    </>
  );
};

export default Chancedetail;
