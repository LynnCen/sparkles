import IconFont from '@/common/components/IconFont';
import Operate from '@/common/components/Operate';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import { message, Switch } from 'antd';
import { FC, useMemo, useRef, useState } from 'react';
import styles from '../../entry.module.less';
import { deleteIndustryArea, exportAllArea, getIndustryArea, importIndustryArea, updateAreaAndRankStatus } from '@/common/api/system';
import EditModal from './EditModal';
import { downloadFile, refactorPermissions } from '@lhb/func';
import ImportModal from '@/common/components/business/ImportModal';
import V2Container from '@/common/components/Data/V2Container';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Table from '@/common/components/Data/V2Table';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { bigdataBtn } from '@/common/utils/bigdata';

const MarketInfo: FC<any> = ({ mainHeight }) => {
  const tableRef: any = useRef(null);

  const columns: any[] = [
    { key: 'id', title: '序号', width: 60, render: (value, record, index) => index + 1, dragChecked: true, },
    { key: 'name', title: '商圈名称', width: 120, dragChecked: true, },
    { key: 'content', title: '商圈简介', width: 120, dragChecked: true, },
    {
      key: 'url', title: '商圈数据', width: 110, dragChecked: true,
      render: (_, record) => {
        const value = record?.excelUrl || record?.url;
        return (value === null ? '-' : (
          <div className={styles.brandBorder}>
            <IconFont iconHref='icon-file_icon_excel' />
            {/* <span className={styles.brandText}>{value.split('attname=')[1]}</span> */}
            <span className={styles.brandText}>{value}</span>
          </div>
        ));
      }
    },
    {
      key: 'showStatus', title: '当前状态', width: 90, dragChecked: true,
      render: (value, row) => <div className={styles.showSwitch}>
        <Switch
          size='small'
          onClick={(checked) => onClickSwitch(checked, row)}
          checked={Boolean(value)} />
        <span className='ml-5'>{value ? '显示' : '隐藏'}</span>
      </div>
    },
    {
      key: 'showRanking', title: '商圈排名', width: 90, dragChecked: true,
      render: (value, row) => <div className={styles.showSwitch}>
        <Switch
          size='small'
          onClick={(checked) => onClickSwitch(checked, row, true)}
          checked={Boolean(value)} />
        <span className='ml-5'>{value ? '显示' : '隐藏'}</span>
      </div>
    },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      width: 100, dragChecked: true,
      render: (value: Permission[], record) => (
        <Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => methods[btn.func as string](record)}
        />
      ),
    },
  ];
  // 顶部按钮
  const [operateExtra, setOperateExtra] = useState<any>([]);
  // 控制导入Modal
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
    id: 0,
    templateId: null
  });
  // 新增/编辑 Modal
  const [editModal, setEditModal] = useState<any>({
    visible: false,
    id: 0
  });
  const [url, setUrl] = useState<any>(null);
  // 用于刷新table数据
  const [params, setParams] = useState<any>({});
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);

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

  const methods = useMethods({
    handleUpdateArea: (record) => {
      bigdataBtn('a83fc227-37d3-4620-8416-0d05e2357f2a', '选址地图配置', '编辑商圈', '点击了编辑商圈');
      setEditModal({
        visible: true,
        id: record.id
      });
    },
    handleDeleteArea: (record) => {
      bigdataBtn('a83fc227-37d3-4620-8416-0d05e2357f2a', '选址地图配置', '删除商圈', '点击了删除商圈');
      V2Confirm({ onSure: (modal) => onDelete(modal, record.id), content: '确定删除该品牌信息' });
    },
    handleImportArea: (record) => {
      bigdataBtn('b07c1f8a-acd5-4a07-bfaf-0072c06235e6', '选址地图配置', '导入商圈', '点击了导入商圈');
      setShowImportModal({
        visible: true,
        id: record.id,
        templateId: record.templateId
      });
      setUrl(record?.excelUrl);
    },
    handleExportArea: (val) => {
      bigdataBtn('ecf3b702-9285-4227-b076-f59f9044407f', '选址地图配置', '导出商圈', '点击了导出商圈');
      const url = val.url;
      if (!url) {
        message.warning(`请检查是否已导入过商圈数据`);
        return;
      };
      downloadFile({
        name: '商圈数据',
        url
      });
    },
    handleCreateArea: () => {
      bigdataBtn('9d25f62e-0e78-43c6-9103-3bed2cec58a6', '选址地图配置', '新增商圈', '点击了新增商圈');
      setEditModal({
        visible: true,
        id: 0
      });
    },
    handleExportAllArea: () => {
      exportAllArea().then(({ url }) => {
        downloadFile({
          name: '全部商圈数据',
          url
        });
      });
    }
  });
  /**
   * @description 刷新获取第一页
   */
  const handleRefresh = () => {
    setParams({});
  };
  /**
   * @description 刷新本页
   */
  const handleRefreshCurrent = () => {
    (tableRef.current as any).onload(true);
  };

  const onClickSwitch = async (checked, row, isRank?: boolean) => {
    // 使用isRank判断操作列，是当前操作列根据checked传递，否则传递之前的值
    const params = {
      id: row.id,
      showStatus: !isRank ? (checked ? 1 : 0) : (row.showStatus || 0),
      showRanking: isRank ? (checked ? 1 : 0) : (row.showRanking || 0),
    };
    try {
      const res = await updateAreaAndRankStatus(params);
      if (res) {
        message.success('切换成功');
        handleRefreshCurrent();
      } else {
        message.error('切换失败');
      }
    } catch (error) {
      message.error('切换失败');
    }
  };
  const onDelete = (modal, id) => {
    deleteIndustryArea({ id }).then(() => {
      message.success('删除成功');
      modal.destroy();
      handleRefreshCurrent();
    });
  };
  const loadData = async (params: any) => {
    const data = await getIndustryArea({ ...params });
    if (!operateList.length) {
      setOperateExtra(data?.meta?.permissions || []);
    }
    return {
      dataSource: data.objectList || [],
      count: data.totalNum || 0,
    };
  };
  const closeHandle = () => {
    setShowImportModal({
      visible: false,
      id: 0,
      templateId: null
    });
  };
  return (
    <div className={styles.marketCon}>
      <V2Container
        style={{ height: mainHeight }}
        emitMainHeight={(h) => setInnerMainHeight(h)}
        extraContent={{
          top:
          <div className='mb-20'>
            <V2Operate
              operateList={operateList}
              onClick={(btn) => methods[btn.func]()}
            />
          </div>
        }}
      >
        <V2Table
          ref={tableRef}
          rowKey='id'
          onFetch={loadData}
          filters={params}
          defaultColumns={columns}
          tableSortModule='consoleSystemIndustryMapMarketInfo'
          hideColumnPlaceholder
          scroll={{ y: innerMainHeight - 48 - 42 }}
          refreshCurrent={true}
        />
      </V2Container>
      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        onSuccess={handleRefresh}
        title='导入商圈数据'
        size={5}
        fileName='重点商圈信息导入模板.xlsx'
        importFile={importIndustryArea}
        extraParams={{ areaId: showImportModal.id, templateId: showImportModal.templateId }}
        url={url}
      />
      <EditModal
        editModal={editModal}
        setEditModal={setEditModal}
        onSuccess={(isUpdate) => isUpdate ? handleRefreshCurrent() : handleRefresh()} />
    </div>
  );
};

export default MarketInfo;
