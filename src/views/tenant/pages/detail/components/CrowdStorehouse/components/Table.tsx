//
import { FC, useState } from 'react';
import { Modal } from 'antd';
import { CrowdStorehouseTableProps } from '../../../ts-config';
import { Permission } from '@/common/components/Operate/ts-config';
import { useMethods } from '@lhb/hook';
import {
  playbackEnable,
  playbackDisable,
  deleteStore
} from '@/common/api/flow';
import Tables from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import RelateThirdparty from './RelateThirdparty';
import SetDevice from './SetDevice';
import { refactorPermissions } from '@lhb/func';

const { confirm } = Modal;
const Table: FC<CrowdStorehouseTableProps> = ({
  searchParams,
  loadData,
  rowSelectionChange,
  setManager,
  selectIds,
  edit,
  updateData,
}) => {
  const [storeId, setStoreId] = useState<number>(0);
  const [relateThirdpartyVisible, setRelateThirdpartyVisible] = useState(false);
  const [thirdpartyStore, setThirdpartyStore] = useState(null);
  const [deviceModalData, setDeviceModalData] = useState({
    visible: false,
    devices: []
  });
  const columns = [
    { title: '店铺名称', key: 'name', width: 200 },
    { title: '店铺编号', key: 'number', width: 100 },
    { title: '租户简称', key: 'tenantName', width: 100 },
    {
      title: '营业时间',
      key: 'startAt',
      width: 160,
      render: (cur: string, record: any) => {
        return `${record.startAt || ''} - ${record.endAt || ''}`;
      }
    },
    {
      title: '摄像头品牌',
      key: 'sourceName',
      width: 100,
      render: (cur: string) => {
        return cur || '-';
      }
    },
    {
      title: '摄像头状态',
      key: 'deviceStatusName',
      width: 100,
      render: (cur: string, record: any) => {
        const { deviceStatus } = record;
        if (deviceStatus === 4 || deviceStatus === 5) { // 异常时要红色提示
          return (
            <span className='color-danger'>{cur}</span>
          );
        }
        return cur;
      }
    },
    { title: '营运状态', key: 'statusName', width: 80 },
    {
      title: '营业日期',
      key: 'startDate',
      width: 200,
      render: (cur: string, record: any) => {
        return `
        ${record.startDate ? record.startDate.replace(/-/g, '.') : ''}
        ${record.startDate && record.endDate ? '-' : ''}
        ${record.endDate ? record.endDate.replace(/-/g, '.') : ''}
        `;
      }
    },
    {
      title: '管理员',
      key: 'managers',
      width: 150,
      render: (managers: any) => {
        if (Array.isArray(managers) && managers.length) {
          return managers.map((manager: any) => manager.name || manager.mobile).join('、');
        }
        return '-';
      }
    },
    {
      key: 'permissions',
      fixed: 'right',
      render: (val: Permission, record: any) => (
        <Operate
          operateList={refactorPermissions(val)}
          onClick={(btn: any) => methods[btn.func](record)} />
      ),
    }
  ];

  const { ...methods } = useMethods({
    handleUpdateStore: ({ id }) => {
      edit(id);
    },
    handleDeleteStore: ({ id }) => {
      confirm({
        title: '删除店铺',
        content: '删除店铺后，客户将无法看到店铺数据',
        onOk() {
          return deleteStore({ id }).then(() => {
            updateData();
          });
        }
      });
    },
    handleRelateStore: ({ id, store }) => {
      setStoreId(id);
      setThirdpartyStore(store);
      setRelateThirdpartyVisible(true);
    },
    handleManagerStore: ({ id, managers }) => {
      setManager(id, managers);
    },
    handleEnablePlayback: ({ id }) => {
      confirm({
        title: '回放设置',
        content: `确定开启回放？`,
        onOk() {
          return playbackEnable({ id }).then(() => {
            updateData();
          });
        }
      });
    },
    handleDisablePlayback: ({ id }) => {
      confirm({
        title: '回放设置',
        content: `确定关闭回放？`,
        onOk() {
          return playbackDisable({ id }).then(() => {
            updateData();
          });
        }
      });
    },
    handleEnableDevice: ({ id, devices }) => {
      setStoreId(id);
      setDeviceModalData({
        visible: true,
        devices
      });
    }
  });

  return (
    <>
      <Tables
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: Array.isArray(selectIds) ? selectIds : [],
          onChange: rowSelectionChange
        }}
        columns={columns}
        onFetch={loadData}
        filters={searchParams}
        bordered
        size='small'
        className='mt-20'
        rowKey='id'/>
      {/* 关联云盯 */}
      <RelateThirdparty
        visible={relateThirdpartyVisible}
        storeId={storeId}
        thirdpartyStore={thirdpartyStore}
        loadData={updateData}
        modalHandle={() => setRelateThirdpartyVisible(false)}/>
      {/* 设置摄像头  */}
      <SetDevice
        storeId={storeId}
        modalData={deviceModalData}
        loadData={updateData}
        modalHandle={() => setDeviceModalData({ visible: false, devices: [] })}/>
    </>
  );
};

export default Table;
