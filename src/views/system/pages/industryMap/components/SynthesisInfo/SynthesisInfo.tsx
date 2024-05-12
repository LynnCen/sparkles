import { deleteIndustryMall, getIndustryMall, importIndustryMall } from '@/common/api/system';
import Operate from '@/common/components/Operate';
import { useClientSize, useMethods } from '@lhb/hook';
import { FC, useMemo, useState } from 'react';
import styles from '../../entry.module.less';
import Table from '@/common/components/FilterTable';
import IconFont from '@/common/components/IconFont';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import EditModal from './EditModal';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { message } from 'antd';
import { downloadFile, refactorPermissions } from '@lhb/func';
import ImportModal from '@/common/components/business/ImportModal';
import { bigdataBtn } from '@/common/utils/bigdata';

const SynthesisInfo: FC<any> = () => {
  const columns: any[] = [
    { key: 'id', title: '序号', width: 120, render: (value, record, index) => index + 1 },
    { key: 'name', title: '品牌名称', width: 120 },
    { key: 'content', title: '品牌简介', width: 120 },
    { key: 'url', title: '品牌数据', width: 120,
      render: (value) => {
        return (value === null ? '-' : (
          <div className={styles.brandBorder}>
            <IconFont iconHref='icon-file_icon_excel' />
            <span className={styles.brandText}>{value.split('attname=')[1]}</span>
          </div>
        ));
      }
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      width: 140,
      render: (value: Permission[], record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func as string](record)}
        />
      ),
    },
  ];
  const scrollHeight = useClientSize().height - 350;
  // 控制导入Modal
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
    id: 0
  });
  // 新增/编辑 Modal
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    id: 0
  });
  const [operateExtra, setOperateExtra] = useState<any>([]);
  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateExtra);
    return list.map((item) => {
      const res: any = {
        name: item.text,
        event: item.event,
        func: item.func,
        type: item.isBatch ? 'default' : 'primary',
      };
      return res;
    });
  }, [operateExtra]);
  const loadData = async(params:any) => {
    const data = await getIndustryMall(params);
    if (!operateList.length) {
      setOperateExtra(data?.meta?.permissions || []);
    }
    return {
      dataSource: data.objectList || [],
      count: data.totalNum || 0,
    };
  };
  const [params, setParams] = useState<any>({});
  const handleRefresh = () => {
    setParams({});
  };
  const methods = useMethods({
    handleCreateMall: () => {
      bigdataBtn('652c4132-cce1-4094-b8ce-6f8ccff3ca7d', '选址地图配置', '新增商场', '点击了新增商场');
      setEditModal({
        visible: true,
        id: 0
      });
    },
    handleUpdateMall: (record) => {
      bigdataBtn('002f5ceb-9376-4a18-9fd3-cf3931d1bd7c', '选址地图配置', '编辑商场', '点击了编辑商场');
      setEditModal({
        visible: true,
        id: record.id
      });
    },
    handleDeleteMall: (record) => {
      bigdataBtn('4ca0b3a3-a065-41e5-8172-1f0e13042288', '选址地图配置', '删除商场', '点击了删除商场');
      ConfirmModal({ onSure: (modal) => onDelete(modal, record.id), content: '确定删除该品牌信息' });
    },
    handleExportMall: ({ url }) => {
      bigdataBtn('6500c39e-302b-43a2-950c-94d098826cf8', '选址地图配置', '导出商场', '点击了导出商场');
      if (!url) {
        message.warning(`请检查是否已导入过商场数据`);
        return;
      };
      downloadFile({
        name: '商场数据',
        url
      });
    },
    handleImportMall: (record) => {
      bigdataBtn('e158094b-4b73-4b8f-bebe-6ff85410a28e', '选址地图配置', '导入商场', '点击了导入商场');
      setShowImportModal({
        visible: true,
        id: record.id
      });
    }
  });
  const onDelete = (modal, id) => {
    deleteIndustryMall({ id }).then(() => {
      message.success('删除成功');
      modal.destroy();
      handleRefresh();
    });
  };
  const closeHandle = () => {
    setShowImportModal({
      visible: false,
      id: 0
    });
    handleRefresh();
  };
  return (
    <div className={styles.synthesisCon}>
      <Operate
        operateList={operateList}
        onClick={(btn) => methods[btn.func]()}
        classNames={styles.operateBtns}
      />
      <Table
        rowKey='id'
        scroll={{ x: 'max-content', y: scrollHeight }}
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
      {/* 商场综合体信息excel 产品还没给 */}
      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        title='导入商场综合体数据'
        fileName='重点品牌信息导入模版.xlsx'
        importFile={importIndustryMall}
        extraParams={{ mallId: showImportModal.id }}
      />
      <EditModal editModal={editModal} setEditModal={setEditModal} onSuccess={handleRefresh}/>
    </div>
  );
};

export default SynthesisInfo;
