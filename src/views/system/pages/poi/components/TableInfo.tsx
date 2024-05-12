/* 用户管理表格 */
import { FC, useState } from 'react';
import Table from '@/common/components/FilterTable';
import V2Operate from '@/common/components/Others/V2Operate';
import { message } from 'antd';
import { deletePoiBrand, importFile } from '@/common/api/system';
import { OperateButtonProps } from '@/common/components/Others/V2Operate';
import styles from '../entry.module.less';
import { useClientSize, useMethods } from '@lhb/hook';
import { downloadFile, refactorPermissions } from '@lhb/func';
import ImportModal from '@/common/components/business/ImportModal';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const UserTable: FC<any> = ({
  setModalData,
  loadData,
  params,
  onSearch
}) => {
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
    id: 0
  });
  const columns: any[] = [
    { key: 'id', title: '序号', width: 120, render: (value, record, index) => index + 1 },
    { key: 'name', title: '品牌名称', width: 120 },
    { key: 'content', title: '品牌简介', width: 120 },
    { key: 'competitionTypeName', title: '竞争关系', width: 120 },
    { key: 'scopeName', title: '数据应用范围', width: 120 },
    {
      key: 'logo', title: '品牌icon', width: 120,
      render: (value) => <img className={styles.logo} src={value} />
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      width: 140,
      render: (value: any[], record) => (
        <V2Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func as string](record)}
        />
      ),
    },
  ];
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height;

  const { ...methods } = useMethods({
    // 编辑
    handleUpdateBrand(record: any) {
      setModalData({
        visible: true,
        id: record.id
      });
    },
    // 导入
    handleImportData({ id }) {
      setShowImportModal({
        visible: true,
        id
      });
    },
    // 导出
    handleExportData({ url }) {
      if (!url) {
        message.warning(`请检查是否已导入过门店数据`);
        return;
      };
      downloadFile({
        name: '门店数据',
        url
      });
    },
    // 删除
    handleDeleteBrand(record: any) {
      V2Confirm({
        content: '此操作将永久删除该数据, 是否继续？',
        onSure: (modal) => onDelete(modal, record.id)
      });
    },
  });

  // 确定删除
  const onDelete = (modal: any, id: number) => {
    deletePoiBrand({ id }).then(() => {
      message.success('删除成功');
      modal.destroy();
      onSearch();
    });
  };

  const closeHandle = () => {
    setShowImportModal({ visible: false, id: 0 });
  };

  return (
    <>
      <Table
        rowKey='id'
        className={styles.tableCon}
        scroll={{ x: 'max-content', y: scrollHeight }}
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        onSuccess={onSearch}
        title='导入门店数据'
        fileName='门店导入模版.xls'
        importFile={importFile}
        extraParams={{ brandId: showImportModal.id }}
      />
    </>

  );
};

export default UserTable;
