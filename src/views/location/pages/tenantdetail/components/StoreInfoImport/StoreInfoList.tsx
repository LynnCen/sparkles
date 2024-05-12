import {
  FC,
  useState,
  useRef,
} from 'react';
import styles from './entry.module.less';
import cs from 'classnames';
import V2Table from '@/common/components/Data/V2Table';
import { useMethods } from '@lhb/hook';
import { downloadFile, refactorPermissions } from '@lhb/func';
import { Button, message, Switch } from 'antd';
import IconFont from '@/common/components/IconFont';
import StoreInfoModal from './StoreInfoModal';
import Operate from '@/common/components/Operate';
import { get, post } from '@/common/request';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import ImportModal from '../ImportModal';
import V2Container from '@/common/components/Data/V2Container';

const StoreInfoList: FC<any> = ({ tenantId, mainHeight }) => {
  const [innerMainHeight, setInnerMainHeight] = useState<number>(0);
  const [editModal, setEditModal] = useState<any>({ visible: false });
  const [showImportModal, setShowImportModal] = useState<any>({
    visible: false,
  });
  // 用于刷新table数据
  const [params, setParams] = useState<any>({});
  const wrapperRref: any = useRef(null); // 容器dom

  const onSearch = () => {
    setParams({});
  };
  const closeHandle = () => {
    setShowImportModal({
      visible: false,
    });
    onSearch();
  };

  const importFile = (params: any) => {
    return post('/demo/import', params, { proxyApi: '/blaster' });
  };
  /* methods */
  const methods = useMethods({
    async fetchData(params) {
      const { objectList = [], totalNum = 0 } = await get(
        '/demo/page',
        { tenantId, ...params },
        { proxyApi: '/blaster' }
      );
      return {
        dataSource: objectList,
        count: totalNum,
      };
    },
    onClickSwitch(checked, row) {
      post('/demo/switch', { tenantId, id: row.id, showStatus: checked ? 1 : 0 }, { proxyApi: '/blaster' }).then(() => {
        onSearch();
      });
    },
    handleEdit(record) {
      setEditModal({ visible: true, id: record.id });
    },
    handleDelete(record) {
      ConfirmModal({
        onSure: () => {
          post('/demo/delete', { id: record.id }, { proxyApi: '/blaster' }).then(() => {
            onSearch();
          });
        },
      });
    },
    handleImport: (record) => {
      setShowImportModal({
        visible: true,
        id: record.id,
      });
    },
    handleExport: ({ url }) => {
      if (!url) {
        message.warning(`请检查是否已导入过行业品牌数据`);
        return;
      }
      downloadFile({
        name: '行业品牌数据',
        url,
      });
    },
  });

  const defaultColumns: any[] = [
    { key: 'id', title: '序号', width: 80, dragChecked: true, render: (value, record, index) => index + 1 },
    { key: 'name', title: '数据名称', width: 180, dragChecked: true },
    { key: 'content', title: '备注', width: 180, dragChecked: true },
    {
      key: 'logo',
      title: '品牌logo',
      width: 80,
      dragChecked: true,
      render: (value) =>
        value ? (
          <div className={styles.logoBorder}>
            <img src={value} />
          </div>
        ) : (
          <span className={styles.noLogo}> -</span>
        ),
    },
    {
      key: 'url',
      title: '品牌数据',
      width: 180,
      dragChecked: true,
      render: (value) => {
        return value === null ? (
          '-'
        ) : (
          <div className={styles.brandBorder}>
            <IconFont iconHref='icon-file_icon_excel' />
            <span className={styles.brandText}>{value}</span>
          </div>
        );
      },
    },
    {
      key: 'showStatus',
      title: '当前状态',
      width: 120,
      dragChecked: true,
      render: (value, row) => (
        <div className={styles.showSwitch}>
          <Switch size='small' onClick={(checked) => methods.onClickSwitch(checked, row)} checked={Boolean(value)} />
          <span className='ml-5'>{value ? '显示' : '隐藏'}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'permissions',
      width: 220,
      dragChecked: true,
      render: (_, record) => (
        <Operate
          operateList={refactorPermissions([
            { event: 'edit', name: '编辑' },
            { event: 'delete', name: '删除' },
            { event: 'import', name: '导入' },
            { event: 'export', name: '导出' },
          ])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];
  return (
    <>
      <div ref={wrapperRref}>
        <V2Container
          style={{ height: mainHeight }}
          emitMainHeight={(h) => setInnerMainHeight(h)}
          extraContent={{
            top: <Button type='primary' className='mb-16' onClick={() => setEditModal({ visible: true })}>
            新增门店
            </Button>
          }}
        >
          <V2Table
          // ref={tableRef}
            defaultColumns={defaultColumns}
            tableSortModule='locSAASLocationTenantDetailStoreInfoImport'
            onFetch={methods.fetchData}
            filters={params}
            className={cs(styles.tableList)}
            rowKey='id'
            // 勿删! 64：分页模块总大小、48分页模块减去paddingBottom的值、42是table头部
            scroll={{ y: innerMainHeight - 48 - 42 }}/>
        </V2Container>
      </div>
      <ImportModal
        visible={showImportModal.visible}
        closeHandle={closeHandle}
        title='导入门店数据'
        fileName='门店信息导入模版.xlsx'
        importFile={importFile}
        extraParams={{ id: showImportModal.id }}
      />
      <StoreInfoModal editModal={editModal} setEditModal={setEditModal} onSuccess={onSearch} tenantId={tenantId} />
    </>
  );
};

export default StoreInfoList;
