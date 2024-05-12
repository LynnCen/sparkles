import { FC, useMemo, useState } from 'react';
import Tables from '@/common/components/FilterTable';
import { Button, message } from 'antd';
import cs from 'classnames';
import styles from '../entry.module.less';
import { useClientSize } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const List: FC<any> = ({ loadData, params }) => {
  const scrollHeight = useClientSize().height - 260;

  const [selectedItems, setSelectedItems] = useState<any>([]);

  const selectedRecordNum = useMemo(() => {
    return selectedItems.length;
  }, [selectedItems]);

  const selectedStoreNum = useMemo(() => {
    if (selectedItems.length > 0) {
      const names = selectedItems.map((item) => item.name);
      const set = new Set(names);
      return set.size;
    }
    return 0;
  }, [selectedItems]);

  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '店铺类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '省市区',
      dataIndex: 'pcd',
      key: 'pcd',
      width: 180,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
      width: 300,
    },
    {
      title: '开业时间',
      dataIndex: 'openTime',
      key: 'openTime',
      width: 80,
    },
    {
      title: '营业时间',
      dataIndex: 'bizTime',
      key: 'bizTime',
      width: 80,
    },
    {
      title: '过店客流（人次）',
      dataIndex: 'passFlow',
      key: 'passFlow',
      width: 180,
    },
    {
      title: '进店客流（人次）',
      dataIndex: 'indoorFlow',
      key: 'indoorFlow',
      width: 180,
    },
    {
      title: '店内订单（笔）',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 180,
    },
    {
      title: '店内销售额（元）',
      dataIndex: 'turnover',
      key: 'turnover',
      width: 180,
    },
  ];

  const onClick = () => {
    if (selectedItems.length === 0) {
      message.warn('请选择门店');
    } else {
      // message.success('洞察成功');
      dispatchNavigate('/insight/list');
    }
  };

  const paginationLeft = (
    <>
      <Button type='primary' onClick={onClick}>
        发起洞察
      </Button>
      <span className='ml-10'>
        已选中{selectedRecordNum}条数据， 共{selectedStoreNum}个店铺
      </span>
    </>
  );

  return (
    <Tables
      className={cs('mt-16', styles.tableWrap)}
      scroll={{ x: 'max-content', y: scrollHeight }}
      columns={columns}
      onFetch={loadData}
      filters={params}
      rowKey='id'
      paginationLeft={paginationLeft}
      rowSelection={{
        type: 'checkbox',
        onChange: (_, selectedRows) => setSelectedItems(selectedItems.concat(selectedRows)),
      }}
    />
  );
};

export default List;
