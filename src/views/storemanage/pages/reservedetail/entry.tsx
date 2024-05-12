import { useEffect, useState } from 'react';
import { Spin } from 'antd';

import cs from 'classnames';
import { post } from '@/common/request';
import { urlParams } from '@lhb/func';
// import { approvalStatusClass } from '@/common/utils/ways';
import styles from './entry.module.less';
import { StoreScore, TabInfo, DynamicDetail } from '@/common/components/business/StoreDetail';
// import { useSelector } from 'react-redux';
import { tenantCheck } from '@/common/api/common';

const ReserveDetail = () => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const id: string | number = urlParams(location.search)?.id;
  const code: string | number = urlParams(location.search)?.code;

  // const tenantCheck = useSelector((state: any) => state.common.tenantCheck);
  const [tenantCheckResult, setTenantCheckResult] = useState<any>({});

  useEffect(() => {
    (async () => {
      const res = await tenantCheck();
      setTenantCheckResult(res);
      const urlMap = {
      // https://yapi.lanhanba.com/project/353/interface/api/46262
        'asics': '/expandShop/reserveStore/asics/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/36805
        'other': '/expandShop/reserveStore/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/49454
        'dynamic': '/expandShop/dynamic/expandShopReport/scoreDetail'
      };
      const detailUrl = urlMap[code];
      post(detailUrl, { id: Number(id) }, true).then((result) => {
        setData({ loading: false, result: result });
      });
    })();
  }, [id, code]);

  // const renderStatus = (value, approveStatus) => {
  //   return <span className={approvalStatusClass(approveStatus)}>{value}</span>;
  // };

  return (
    <>
      {data.loading ? (
        <Spin />
      ) : (
        <div className={cs(styles.container, 'bg-fff', 'pd-20')}>
          { (code === 'asics' || code === 'other') && <>
            <StoreScore
              result={data.result}
              showAuditInfo={true}
              isAsics={code === 'asics'}
              id={id}
              isReserve
            />
            <TabInfo
              result={data.result}
              showTab={true}
              isFood={tenantCheckResult.isFood}
              isAsics={code === 'asics'}
            />
          </>}
          {/* 动态表单详情 */}
          {code === 'dynamic' && <DynamicDetail title={data.result?.reportName} data={data.result}/>}
        </div>
      )}
    </>
  );
};
export default ReserveDetail;
