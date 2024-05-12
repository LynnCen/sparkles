/**
 * @Description 已录清单列表
 */

import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import { useMethods } from '@lhb/hook';
import { useEffect, useState } from 'react';
import styles from './index.module.less';
import { post } from '@/common/request';

const EnterListModal = ({
  open,
  setOpen,
  cityId,
  setDetailDrawer
}) => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [filters, setFilters] = useState<any>({});

  const defaultColumns = [
    {
      key: 'name', title: '商圈名称', render(val, record) {
        return <span className={styles.nameText} onClick={() => methods.toEnterDetail(record)}>{val}</span>;
      }
    },
    { key: 'city', title: '城市', width: 100, },
    { key: 'district', title: '城区', width: 100, },
    { key: 'spotStatusName', title: '商圈集客点状态', width: 140, },
    { key: 'relationSpots', title: '已提交', width: 100, render(val) { return <span className={styles.submitNumText}>{val}</span>; }, },
    { key: 'submitter', title: '录入人', width: 120, },
    { key: 'submittedAt', title: '录入时间' },
  ];

  useEffect(() => {
    if (open && cityId) {
      setFilters({ ...filters, cityId });
    }
  }, [open, cityId]);

  const methods = useMethods({
    async loadData(params: any) {
      const { objectList } = await post('/plan/spot/planCluster/submitted/page', { ...params, cityId });
      return {
        dataSource: objectList || [],
        count: objectList?.length,
      };
    },
    toEnterDetail(record) {
      setDetailDrawer((state) => ({
        ...state,
        id: record?.planClusterId
      }));
    }
  });

  return (
    <V2Drawer open={open} onClose={() => setOpen(false)}>
      <V2Container
        // 容器上下padding 32， 所以减去就是64
        style={{ height: 'calc(100vh - 64px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <V2Title className='mb-24'>商圈已录入清单</V2Title>,
        }}
      >
        <V2Table
          rowKey='planClusterId'
          filters={filters}
          // 勿删! 64：分页模块总大小、52:分页模块减去paddingBottom的值、42:table头部
          scroll={{ y: mainHeight - 52 - 42 }}
          defaultColumns={defaultColumns}
          type='easy'
          hideColumnPlaceholder
          onFetch={methods.loadData}
        />
      </V2Container>
    </V2Drawer>
  );
};

export default EnterListModal;

