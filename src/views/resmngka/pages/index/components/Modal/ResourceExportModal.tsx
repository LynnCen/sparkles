import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import { downloadFileStream } from '@/common/utils/ways';
import { Button, Checkbox, message, Modal, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ResourceModalProps } from '../../ts-config';

const ExportModal: React.FC<ResourceModalProps> = ({
  resourceModalInfo,
  setResourceModalInfo,
  setToExportItems,
  onExport,
  onSearch,
}) => {
  const [dataSource, setDataSource] = useState<any>([]);
  const columns = [
    {
      title: '场地-点位名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'delete',
      key: 'delete',
      render: (_, record) => (
        <Space size='middle'>
          <a
            onClick={() => {
              const filterDataSource = resourceModalInfo.toExportItems?.filter((item) => item.id !== record.key);
              setResourceModalInfo({ toExportItems: filterDataSource, visible: true });
              setToExportItems(filterDataSource);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const { parseTitle, onCancel, onSubmit, onClear } = useMethods({
    parseTitle() {
      return (<>
        导出列表
        <Checkbox checked={checked} onChange={onCheckChange} style={{ marginLeft: 30 }}>导出历史成交信息</Checkbox></>);
    },
    onCancel() {
      setResourceModalInfo({ ...resourceModalInfo, visible: false });
    },
    // 确定
    onSubmit() {
      const exportIds = resourceModalInfo.toExportItems?.map((item) => item.id) || [];
      if (!exportIds.length) {
        message.warning('至少选择一项');
      } else {
        get('/export/resource/ka', { spotIdList: exportIds, showHistory: checked }, { responses: { responseType: 'arraybuffer' } })
          .then((data) => {
            downloadFileStream(data, '点位列表.xlsx');
          })
          .then(() => {
            message.success('操作成功');
            onExport();
            onCancel();
            onSearch();
            setTimeout(() => {
              onSearch();
            }, 1000);
          });
      }
    },
    onClear() {
      setResourceModalInfo({ toExportItems: [], visible: true });
      setToExportItems([]);
    },
  });

  useEffect(() => {
    if (resourceModalInfo.toExportItems && resourceModalInfo.toExportItems.length > 0) {
      const ops = resourceModalInfo.toExportItems.map((item) => {
        return { name: item.name, key: item.id };
      });
      setDataSource(ops);
    } else {
      setDataSource([]);
    }
  }, [resourceModalInfo]);

  const [checked, setChecked] = useState<boolean>(false);

  const onCheckChange = (e: any) => {
    setChecked(e.target.checked);
  };

  return (
    <Modal title={parseTitle()} open={resourceModalInfo.visible} onCancel={onCancel} onOk={onSubmit} okText={'导出'}>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <div className='rt' style={{ marginRight: '-10px', marginTop: '10px' }}>
        <Button type='primary' onClick={onClear}>
          清空列表
        </Button>
      </div>
    </Modal>
  );
};
export default ExportModal;
