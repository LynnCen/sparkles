import { FC } from 'react';
import Tables from '@/common/components/FilterTable';
import { message, Modal, Typography } from 'antd';
import cs from 'classnames';
import styles from '../entry.module.less';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { refactorPermissions } from '@lhb/func';

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
        },
      });
    },
  });

  const columns = [
    {
      title: <div className='ml-28'>店铺名称</div>,
      key: 'name',
      width: 155,
      render: (value: string, record) =>
        record?.isFather ? (
          <div className='bold'>
            {value}: 计划开店{record.planNum}个 已开店{record.openedNum}个 机会点{record.chanceNum}个 计划踩点
            {record.planFootNum}个 已踩点{record.footedNum}个
          </div>
        ) : (
          <Link className={styles.linkWrap}>{value}</Link>
        ),
      onCell: (record) => ({
        colSpan: record?.isFather ? 6 : 1,
      }),
    },
    {
      title: '当前阶段',
      dataIndex: 'period',
      key: 'period',
      width: 80,
      onCell: (record) => ({
        colSpan: record?.isFather ? 0 : 1,
      }),
    },
    {
      title: '店铺评分',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      onCell: (record) => ({
        colSpan: record?.isFather ? 0 : 1,
      }),
    },
    {
      title: '工作日日均过店客流',
      // dataIndex: 'flow',
      key: 'flow',
      width: 150,
      onCell: (record) => ({
        colSpan: record?.isFather ? 0 : 1,
      }),
    },
    {
      title: '节假日日均过店客流',
      dataIndex: 'weekendFlow',
      key: 'weekendFlow',
      width: 150,
      onCell: (record) => ({
        colSpan: record?.isFather ? 0 : 1,
      }),
    },
    {
      title: '省市区',
      dataIndex: 'province',
      key: 'province',
      width: 170,

      render: (_, record) => (
        <div>
          {record.province}/{record.city}/{record.district}
        </div>
      ),
      onCell: (record) => ({
        colSpan: record?.isFather ? 0 : 1,
      }),
    },
    {
      title: '地址',
      // dataIndex: 'address',
      key: 'address',
      width: 180,
    },
    {
      title: '操作',
      key: 'permissions',
      width: 200,
      render: (value: any, record) =>
        record?.isFather ? (
          <Operate
            operateList={refactorPermissions([
              // nox接口下线，创建拓店废弃
              // { name: '新增拓店', event: 'addExpandTask' },
              { name: '新增踩点', event: 'addFootTask' },
              { name: '删除', event: 'delete' },
            ])}
            onClick={(btn: any) => methods[btn.func](record)}
          />
        ) : (
          <></>
        ),
      onCell: (record) => ({
        colSpan: record?.isFather ? 1 : 1,
      }),
    },
  ];

  return (
    <Tables
      className={cs('mt-16', styles.tableWrap)}
      expandable={{
        indentSize: 0,
      }}
      columns={columns}
      onFetch={loadData}
      filters={params}
      rowKey='id'
    />
  );
};

export default List;
