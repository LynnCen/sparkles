import Operate from '@/common/components/Operate';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Table } from 'antd';
import { FC } from 'react';
import { IndustryTableProps } from '../ts-config';
import styles from '../entry.module.less';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

// 行业table
const DetailTable: FC<IndustryTableProps> = ({
  industryTableInfo,
  onSearch,
  tableDisplay,
  setTableDisplay,
  setModalVisible,
  setIndustryModalInfo,
}) => {
  /* methods */
  const { ...methods } = useMethods({
    handleUpdate() {
      setIndustryModalInfo(industryTableInfo);
      setModalVisible(true);
    },
    handleDelete() {
      V2Confirm({
        onSure: () => {
          post('/resource/industry/delete', { id: industryTableInfo.id }, true).then(() => {
            setTableDisplay('none');
            onSearch();
          });
        },
        content: '此操作将永久删除该数据, 是否继续？'
      });
    },
  });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '显示名称',
      dataIndex: 'anotherName',
      key: 'anotherName',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      render: (_, record) => (
        <Operate
          operateList={refactorPermissions(record.permissions)}
          onClick={(btn: FormattingPermission) => {
            methods[btn.func](record);
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.form}>
      <div style={{ display: tableDisplay }}>
        <div className={styles.title}>{industryTableInfo.name}</div>
        <Table
          rowKey='id'
          bordered
          dataSource={industryTableInfo.id ? [{ ...industryTableInfo }] : []}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default DetailTable;
