import { useEffect, useState, useMemo } from 'react';
import { Spin } from 'antd';

import cs from 'classnames';
import { post } from '@/common/request';
import { urlParams } from '@lhb/func';
// import { approvalStatusClass } from '@/common/utils/ways';
import styles from './entry.module.less';
import { StoreScore, TabInfo, DynamicDetail } from '@/common/components/business/StoreDetail';
import Surround from '@/common/components/business/StoreDetail/components/Surround';
// import { useSelector } from 'react-redux';
import { tenantCheck, } from '@/common/api/common';

const TapDetail = () => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const id: string | number = urlParams(location.search)?.id;
  const code: string = urlParams(location.search)?.code;

  // const tenantCheck = useSelector((state: any) => state.common.tenantCheck);
  const [tenantCheckResult, setTenantCheckResult] = useState<any>({});

  useEffect(() => {
    (async () => {
      const res = await tenantCheck();
      // const { isAsics } = res || {};
      setTenantCheckResult(res);

      const urlMap = {
        // https://yapi.lanhanba.com/project/353/interface/api/46262
        'asics': '/chancePoint/asics/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/34428
        'other': '/chancePoint/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/49447
        'dynamic': '/expandShop/dynamic/chancePoint/scoreDetail'
      };
      const detailUrl = urlMap[code];
      // const detailUrl = isAsics ? '/chancePoint/asics/detail' : '/chancePoint/detail';
      post(detailUrl, { id: Number(id) }, { isMock: false, mockId: 353 }).then((result) => {
        setData({ loading: false, result: result });
      });
    })();
  }, [id, code]);

  // const renderStatus = (value, approveStatus) => {
  //   return <span className={approvalStatusClass(approveStatus)}>{value}</span>;
  // };

  /**
   * @description 是否有周边查询入口
   */
  const hasSurroundPermission = useMemo(() => {
    const { result } = data;
    return result && Array.isArray(result.permissions) && !!result.permissions.filter((item) => item.event === 'surroundReport:pcEntrance').length;
  }, [data]);

  return (
    <>
      {data.loading ? (
        <Spin />
      ) : (
        <div className={cs(styles.container)}>
          {(code === 'asics' || code === 'other') && <>
            <StoreScore
              result={data.result}
              showExportBtn={true}
              isBabyCare={tenantCheckResult.isBabyCare}
              isAsics={code === 'asics'}
              isChancepoint
              id={id}
            />
            <div className='mt-10 bg-fff pt-12 pb-12 pl-20 pr-20'>
              {hasSurroundPermission && <Surround detail={data?.result}/>}
            </div>
            <TabInfo
              result={data.result}
              isFood={tenantCheckResult.isFood}
              isAsics={code === 'asics'}
              // isBabyCare={isBabyCare}
            />
          </>
          }
          {/* 动态表单详情 */}
          {code === 'dynamic' && <DynamicDetail title={data.result?.chancePointName} data={data.result}/>}
        </div>
      )}
    </>
  );
};
export default TapDetail;
