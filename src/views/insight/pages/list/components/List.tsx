import { FC } from 'react';
import Tables from '@/common/components/FilterTable';
import { message, Modal, Typography } from 'antd';
import cs from 'classnames';
import styles from '../entry.module.less';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Link } = Typography;

const List: FC<any> = ({ loadData, params, setModalData, onSearch }) => {
  const { ...methods } = useMethods({
    handleAddExpandTask() {
      setModalData({ visible: true });
    },
    handleAddFootTask() {
      dispatchNavigate('/footprinting/manage');
    },
    handleDelete(record) {
      Modal.confirm({
        title: '删除',
        content: '确定删除该条记录？',
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          onSearch({ deleteId: record.id });
          message.success('删除成功');
          //
          methods.handleDelete();
        },
      });
    },
  });

  const columns = [
    {
      title: '洞察编号',
      dataIndex: 'no',
      key: 'no',
      width: 70,
      render: (value: string, record) => <Link href={`/insight/report?id=${record.no}`}>{value}</Link>,
    },
    {
      title: '洞察店铺数',
      dataIndex: 'storeNum',
      key: 'storeNum',
      width: 80,
    },
    {
      title: '洞察店铺',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 470,
    },
    {
      title: '洞察时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
    },
    {
      title: '洞察状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
    },
    {
      title: 'H5二维码',
      dataIndex: 'qrcode',
      key: 'qrcode',
      width: 80,
    },
  ];

  return (
    <Tables
      className={cs('mt-16', styles.tableWrap)}
      columns={columns}
      onFetch={loadData}
      filters={params}
      rowKey='id'
    />
  );
};

export default List;
