// 客流宝
import { FC, useState, useMemo } from 'react';
import { Drawer, Space, Modal, message as Message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useMethods } from '@lhb/hook';
import { Permission } from '@/common/components/Operate/ts-config';
import {
  CrowdStorehouseProps,
  CrowdStorehouseSearchParams,
  StoreListItem,
  Manager,
  ManagerState
} from '../../ts-config';
import {
  storeList,
  batchDeleteStore
} from '@/common/api/flow';
import { UserListItem } from '@/common/components/Select/UserList';
import dayjs from 'dayjs';
import Search from './components/Search';
import Operate from '@/common/components/Operate';
import Table from './components/Table';
import ImportStore from './components/ImportStore';
import BatchDeleteManager from './components/BatchDeleteManager';
import SetManager from './components/SetManager';
import StoreForm from './components/StoreForm';
import { refactorPermissions } from '@lhb/func';

const { confirm } = Modal;
const CrowdStorehouse: FC<CrowdStorehouseProps> = ({
  visible,
  drawerClose,
  tenantId
}) => {
  const [searchParams, setSearchParams] = useState<CrowdStorehouseSearchParams>({
    tenantId,
    name: '',
    source: '',
    deviceStatus: '',
    status: '',
    businessDate: '',
    start: '',
    end: '',
    manager: '',
    // startDate: '',
    // endDate: '',
    isCurPage: false // 是否在当前页刷新
  });
  const [selectIds, setSelectIds] = useState<number[] | number>([]);
  const [storeListData, setStoreListData] = useState<StoreListItem[]>([]);
  const [operateBtn, setOperateBtn] = useState<Permission[]>([]);
  const [importVisable, setImportVisable] = useState(false);
  const [storeModalData, setStoreModalData] = useState<any>({
    visible: false,
    id: '', // 编辑id
    tenantId // 租户id
  });
  const [batchDelManager, setBatchDelManager] = useState<ManagerState>({
    visible: false,
    managers: []
  });
  const [administrators, setAdministrators] = useState<ManagerState>({
    visible: false,
    managers: [],
    isBatch: false
  });

  // 获取当前选中的门店下的管理员
  function getManagers(listData: StoreListItem[], ids: number[]) {
    const selectedData = listData.filter((item: StoreListItem) => ids.includes(item.id));
    return selectedData.reduce((acc: Manager[], cur: StoreListItem) => {
      const { managers } = cur;
      managers.forEach((manager: any) => {
        const { name, mobile } = manager;
        if (!name) { // name可能为null
          manager.name = mobile;
        }
        if (acc.findIndex((item: any) => item.mobile === manager.mobile) === -1) {
          acc.push(manager);
        }
      });
      return acc;
    }, []);
  }

  // methods
  const {
    searchChange,
    loadData,
    reloadHandle,
    handleSingleSetManager,
    ...methods
  } = useMethods({
    searchChange: (fieldsValue: Record<string, any>) => {
      const {
        name,
        source,
        deviceStatus,
        status,
        manager,
        businessDate
      } = fieldsValue;
      const params: any = {
        name,
        source,
        deviceStatus,
        status,
        manager,
        isCurPage: false,
        start: '',
        end: ''
        // ...fieldsValue,
        // tenantId,
        // startDate: fieldsValue?.startDate ? dayjs(fieldsValue.startDate).format('YYYY-MM-DD') : '',
        // endDate: fieldsValue?.endDate ? dayjs(fieldsValue.endDate).format('YYYY-MM-DD') : '',
        // isCurPage: false,
      };
      if (Array.isArray(businessDate) && businessDate.length) {
        params.start = dayjs(businessDate[0]).format('YYYY-MM-DD');
        params.end = dayjs(businessDate[1]).format('YYYY-MM-DD');
      }
      setSearchParams(params);
    },
    reloadHandle: () => {
      setSearchParams((state) => ({ ...state, isCurPage: true }));
    },
    loadData: async (params: Record<string, any> = {}) => {
      const { objectList, totalNum, meta } = await storeList({ ...searchParams, ...params });
      setStoreListData(objectList);
      if (!operateList.length) {
        setOperateBtn(meta?.permissions || []);
      }
      setSelectIds([]);
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    handleCreateStore: () => { // 新增门店
      setStoreModalData((state) => ({ ...state, visible: true, id: '' }));
    },
    handleImportStore: () => { // 导入门店
      setImportVisable(true);
    },
    handleBatchDelete: () => {
      confirm({
        title: '删除门店',
        content: '删除门店后，客户将无法看到门店数据',
        onOk() {
          return batchDeleteStore({ ids: selectIds as number[] }).then(() => {
            searchChange({});
          });
        }
      });
    },
    handleSingleSetManager: (id: number, managers: UserListItem[]) => { // 单个门店设置管理员
      setSelectIds(id);
      setAdministrators({
        visible: true,
        managers
      });
    },
    handleBatchAddManager: () => { // 批量添加管理员（只做添加）
      setAdministrators({
        visible: true,
        managers: [],
        isBatch: true
      });
    },
    handleBatchSetManager: () => { // 批量设置管理员（会覆盖之前门店的管理员）
      const managerArr = getManagers(storeListData, selectIds as number[]);
      setAdministrators({
        visible: true,
        managers: managerArr,
        isBatch: false
      });
    },
    handleBatchDeleteManager: () => { // 批量删除管理员
      const managerArr = getManagers(storeListData, selectIds as number[]);
      if (!managerArr.length) {
        Message.warning('选择的门店未包含管理员');
        return;
      }
      setBatchDelManager({
        visible: true,
        managers: managerArr
      });
    },
  });

  const operateList: any = useMemo(() => {
    const list = refactorPermissions(operateBtn);

    return list.map((item: Record<string, any>) => {
      const res: any = {
        name: item.text,
        disabled: item.isBatch ? !(selectIds as number[]).length : false,
        type: item.isBatch ? 'default' : 'primary',
        onClick: () => methods[item.func](),
      };
      return res;
    });
    // eslint-disable-next-line
  }, [operateBtn, selectIds]);

  return (
    <>
      <Drawer
        title='客流宝'
        placement='right'
        open={visible}
        width='850'
        closable={false}
        onClose={() => drawerClose(false)}
        extra={
          <Space>
            <CloseOutlined onClick={() => drawerClose(false)}/>
          </Space>
        }>
        <Search change={searchChange} />
        <Operate operateList={operateList} showBtnCount={7}/>
        <Table
          loadData={loadData}
          searchParams={searchParams}
          updateData={() => searchChange({})}
          selectIds={selectIds as number[]}
          edit={(id) => setStoreModalData((state) => ({ ...state, visible: true, id }))}
          setManager={(id, managers) => handleSingleSetManager(id, managers)}
          rowSelectionChange={setSelectIds}/>

        {/* 导入门店 */}
        <ImportStore
          visible={importVisable}
          loadData={() => searchChange({})}
          tenantId={tenantId}
          modalHandle={() => setImportVisable(false)}/>
      </Drawer>

      {/* 批量删除管理员 */}
      <BatchDeleteManager
        storeIds={selectIds}
        modalData={batchDelManager}
        loadData={() => searchChange({})}
        modalHandle={() => setBatchDelManager({ visible: false, managers: [] })}/>
      {/* 设置/批量设置管理员 */}
      <SetManager
        storeIds={selectIds}
        tenantId={tenantId}
        modalData={administrators}
        loadData={reloadHandle}
        modalHandle={() => setAdministrators({ visible: false, managers: [], isBatch: false })}/>
      {/* 新增/编辑门店 */}
      <StoreForm
        modalData={storeModalData}
        loadData={() => searchChange({})}
        modalHandle={() => setStoreModalData((state) => ({ ...state, visible: false, id: '' }))}/>
    </>
  );
};

export default CrowdStorehouse;
