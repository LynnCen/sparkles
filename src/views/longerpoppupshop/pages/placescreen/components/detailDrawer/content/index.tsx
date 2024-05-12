import { useEffect, useState } from 'react';
import { Spin } from 'antd';

import cs from 'classnames';
import { post } from '@/common/request';
import styles from './entry.module.less';
import { DynamicDetail } from '@/common/components/business/StoreDetail';
import { useSelector } from 'react-redux';

const ContentDetail = ({ record, origin }) => {
  const [data, setData] = useState<{ loading: boolean; result: any }>({ loading: true, result: {} });
  const tenantCheck = useSelector((state: any) => state.common.tenantCheck);
  const { id, code } = record;

  useEffect(() => {
    (async () => {
      const urlMap = {
        // https://yapi.lanhanba.com/project/353/interface/api/46122
        asics: '/expandShop/alternate/asics/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/36812
        other: '/expandShop/alternate/detail',
        // https://yapi.lanhanba.com/project/353/interface/api/49454
        /* 场地筛选和场地管理调用不同的详情接口 */
        dynamic: origin === 'PlaceScreen' ? '/expandShop/dynamic/chancePoint/scoreDetail' : '/expandShop/dynamic/expandShopReport/scoreDetail',
      };
      const detailUrl = urlMap[code];
      post(detailUrl, { id: Number(id) }, true).then((result) => {
        setData({ loading: false, result: result });
      });
    })();
  }, [id, tenantCheck, code, origin]);

  return (
    <>
      {data.loading ? (
        <Spin />
      ) : (
        <div className={cs(styles.container)}>
          <DynamicDetail title={data.result?.reportName} data={data.result} anchorCustomStyle={{ top: '120px' }} />
        </div>
      )}
    </>
  );
};
export default ContentDetail;
