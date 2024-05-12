import { useEffect, useState } from 'react';
import { Spin } from 'antd';

import cs from 'classnames';
import { post } from '@/common/request';
import { urlParams } from '@lhb/func';
// import { approvalStatusClass } from '@/common/utils/ways';
import styles from './entry.module.less';
import { StoreScore, TabInfo, DynamicDetail } from '@/common/components/business/StoreDetail';
import { useSelector } from 'react-redux';

const AlternativeDetail = () => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const id: string | number = urlParams(location.search)?.id;
  const code: string = urlParams(location.search)?.code;
  const tenantCheck = useSelector((state: any) => state.common.tenantCheck);

  useEffect(() => {
    (async () => {
      const urlMap = {
        // https://yapi.lanhanba.com/project/353/interface/api/46122
        'asics': '/expandShop/alternate/asics/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/36812
        'other': '/expandShop/alternate/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/49454
        'dynamic': '/expandShop/dynamic/expandShopReport/scoreDetail'
      };
      const detailUrl = urlMap[code];
      post(detailUrl, { id: Number(id) }, true).then((result) => {
        setData({ loading: false, result: result });
      });
    })();
  }, [id, tenantCheck, code]);

  // const renderStatus = (value, approveStatus) => {
  //   return <span className={approvalStatusClass(approveStatus)}>{value}</span>;
  // };

  return (
    <>
      {data.loading ? (
        <Spin />
      ) : (
        <div className={cs(styles.container)}>
          { (code === 'asics' || code === 'other') && <>
            <StoreScore
              result={data.result}
              showAuditInfo={true}
              showExportBtn={true}
              isBabyCare={tenantCheck.isBabyCare}
              isAsics={code === 'asics'}
              isAlternative
              id={id}
            />
            <TabInfo
              result={data.result}
              showTab={true}
              isFood={tenantCheck.isFood}
              isAsics={code === 'asics'}
              // isBabyCare={isBabyCare}
            />
          </>
          }
          {/* 动态表单详情 */}
          {code === 'dynamic' && <DynamicDetail title={data.result?.reportName} data={data.result}/>}
        </div>
      )}
    </>
  );
};
export default AlternativeDetail;
