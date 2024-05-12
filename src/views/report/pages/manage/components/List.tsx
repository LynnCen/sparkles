import React, { useRef } from 'react';
import { Modal, message, Progress } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { deleteReportTemp, exportReportTemp } from '@/common/api/report';
import { dateFormatShow } from '@/common/utils/ways';
import styles from './index.module.less';
import { ListProps } from '../ts-config';
import { useMethods } from '@lhb/hook';
import { downloadFile, refactorPermissions } from '@lhb/func';

const List: React.FC<ListProps> = ({
  params,
  loadData,
  updateReport,
  onRefresh,
  refresh
}) => {
  const tableRef = useRef<any>(null);
  const columns = [
    { key: 'name', title: '报表名称', width: 200 },
    { key: 'stores', title: '门店', width: 200 },
    {
      key: 'date', title: '时间段', width: 200, render: (value) => {
        return value.includes('-') ? `${dateFormatShow(value.substring(0, 10))}-${dateFormatShow(value.substring(11, 21))}` : value;
      }
    },
    { key: 'remark', title: '备注', width: 200 },
    {
      key: 'permissions', title: '操作', align: 'center', width: 160, render: (value, record) => (
        <div className={styles.permissionsCell}>
          <Operate
            classNames={styles.permissions}
            operateList={refactorPermissions(value)}
            onClick={(btn: any) => methods[btn.func](record)}
          />
          {record.isExporting && <Progress percent={50} status='active' showInfo={false}/>}
        </div>
      )
    },
  ];

  const methods = useMethods({
    handleExport(record: any) {
      exportReportTemp({ id: record.id }).then(() => {
        refresh();
        message.success('正在生成报表，请稍后刷新页面查看。');
      });
    },
    handleUpdateReportTemplate(record: any) {
      updateReport(record.id);
    },
    handleDeleteReportTemplate(record: any) {
      Modal.confirm({
        title: '删除报表',
        content: '确定删除该报表？',
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        cancelText: '取消',
        onOk: (close) => {
          const params = {
            id: record.id,
          };
          deleteReportTemp(params).then(() => {
            message.success('删除成功');
            close && close();
            onRefresh();
          });
        },
      });
    },
    handleDownload(record: any) {
      downloadFile({ url: record.url });
    }
  });

  return (
    <div className={styles.list}>
      <Table
        refreshCurrent={true}
        ref={tableRef}
        rowKey='id'
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
    </div>
  );
};

export default List;
