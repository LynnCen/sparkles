import { FC, useContext, useMemo, useState } from 'react';
import { orderManageList } from '@/common/api/order';
import { SearchParams } from './ts-config';
import styles from './entry.module.less';
import dayjs from 'dayjs';
import Search from './components/Search';
import Table from './components/Table';
import { getKeys } from '@/common/utils/ways';
import UserInfoContext from '@/layout/context';
import { UserInfoProps } from '@/layout';
import { useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const OrderManage: FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    storeIds: [],
    start: null,
    end: null,
  });
  const userInfo: UserInfoProps = useContext(UserInfoContext);

  const [operateExtra, setOperateExtra] = useState<any[]>([]);

  const operateList: any = useMemo(() => {
    const list = operateExtra.slice();
    // 如果预测页面在菜单列表中，则添加前往预测按钮
    const allUri = getKeys(userInfo.moduleList || [], [], 'uri', 'children', true);
    const isIN = allUri.includes('/predict');
    if (isIN) {
      list.push({ name: '前往预测', event: 'report:toPreview' });
    }
    return refactorPermissions(list).map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };

      return res;
    });
  }, [operateExtra, userInfo.moduleList]);

  // methods
  const { loadData, searchChange } = useMethods({
    loadData: async (params: any) => {
      const { objectList, totalNum, meta } = await orderManageList({ ...searchParams, ...params });
      setOperateExtra(meta.permissions || []);
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    searchChange: (fieldsValue: Record<string, any>) => {
      const { storeIds, ranges } = fieldsValue || {};
      const len = Array.isArray(ranges) && ranges.length;
      const params: SearchParams = {
        storeIds,
        start: null,
        end: null,
      };
      Array.isArray(storeIds) && storeIds.length && (params.storeIds = storeIds);
      if (len) {
        params.start = dayjs(ranges[0]).format('YYYY-MM-DD');
        params.end = dayjs(ranges[1]).format('YYYY-MM-DD');
      }
      setSearchParams(params);
    },
  });

  return (
    <div className={styles.container}>
      <Search change={searchChange} searchParams={searchParams} operateList={operateList} />
      <Table loadData={loadData} searchParams={searchParams} />
    </div>
  );
};

export default OrderManage;
