import { FC, useRef, useState } from 'react';
import { message, Switch } from 'antd';
import IconFont from '@/common/components/IconFont';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import DeviceModal from './DeviceModal';
import styles from '../index.module.less';
import cs from 'classnames';
import { flowDeviceList, postFlowDeviceDelete, postDeviceUpdateHot, postDeviceUpdateLive, postFlowDeviceUpdatePlayback } from '@/common/api/passenger-flow';
import { SourceValue, PermissionEvent } from '../../../ts-config';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { refactorPermissions } from '@lhb/func';

const DeviceList: FC<any> = ({ params = {}, detail, storeId, sourceName }) => {

  const [deviceModalData, setDeviceModalData] = useState<any>({
    visible: false,
    type: 1, // 1 新增 2 编辑
    flowStoreId: null,
    sourceName: '',
    detail,
    deviceData: {}
  });

  const tableRef = useRef<any>();

  // table-在线状态展示字段
  const onlineStatus = (val: any) => {
    const online = Number(val) === 1;
    return <div className={styles.statusOuter}>
      <IconFont className={cs(styles.statusIcon, online ? styles.statusOnline : styles.statusOffline)} iconHref='icon-a-bianzu131' />
      <span className={cs(styles.statusText, 'ml-5')}>{online ? '在线' : '离线'}</span>
    </div>;
  };

  const onHeatChange = (checked: boolean, record: any) => {
    postDeviceUpdateHot({ id: record.id, isOn: !!checked }).then(() => {

    }, () => {
      message.error('设置失败，请重试！');
    });
  };

  const onRealChange = (checked: boolean, record: any) => {
    postDeviceUpdateLive({ id: record.id, isOn: !!checked }).then(() => {

    }, () => {
      message.error('设置失败，请重试！');
    });
  };

  const onPlaybackChange = (checked: boolean, record: any) => {
    postFlowDeviceUpdatePlayback({ id: record.id, isOn: !!checked }).then(() => {

    }, () => {
      message.error('设置失败，请重试！');
    });
  };

  // 列表项
  const columns = [
    { title: '设备名称', key: 'name', },
    { title: 'SN码', key: 'sn', },
    { title: '通道', key: 'chnno', width: 60 },
    { title: '用途', key: 'useName' },
    detail.source === SourceValue.HW && { title: '过店', key: 'passTypeName' },
    detail.source === SourceValue.HW && {
      title: '进店',
      key: 'indoorTypeName',
      render(_:string, record: any) {
        return (
          <span>{record.indoorTypeName}{record.indoorDirectionName ? `（${record.indoorDirectionName}）` : ''}</span>
        );
      },
    },
    {
      title: '热力图',
      key: 'openHotspot',
      render(_:string, record: any) {
        return (
          <Switch onChange={(checked) => onHeatChange(checked, record)} defaultChecked={!!record.openHotspot}/>
        );
      },
    },
    {
      title: '实时视频',
      key: 'openLive',
      render(_:string, record: any) {
        return (
          <Switch onChange={(checked) => onRealChange(checked, record)} defaultChecked={!!record.openLive}/>
        );
      },
    },
    {
      title: '回放视频',
      key: 'openPlayback',
      render(_:string, record: any) {
        return (
          <Switch onChange={(checked) => onPlaybackChange(checked, record)} defaultChecked={!!record.openPlayback}/>
        );
      },
    },
    { title: '状态', key: 'status', render: (val) => onlineStatus(val) },
    {
      title: '操作',
      key: 'permissions',
      render: (value: any, record) => (
        <Operate operateList={methods.operateBtns()} onClick={(btn: any) => {
          methods[btn.func](record);
        }}/>
      ),
    },
  ];

  /* methods */
  const methods = useMethods({
    async fetchData() {
      let datas = [];
      if (detail.source === SourceValue.HW || detail.source === SourceValue.YD) {
        datas = await flowDeviceList({ storeId });
      }
      return {
        dataSource: datas,
        count: datas.length
      };
    },
    operateBtns: () => {
      // 接口返回的权限信息
      const tempBtns = !detail ? [] : refactorPermissions(detail.permissions);

      // 筛选需要展示按钮，并指定文案
      const btns: any = [];
      tempBtns.forEach((per: any) => {
        if (per.event === PermissionEvent.DEVICE_ATTACH) {
          const text = '编辑';
          btns.push({
            ...per,
            name: text,
            text,
          });
        } else if (per.event === PermissionEvent.DEVICE_DELETE) {
          const text = '删除';
          btns.push({
            ...per,
            name: text,
            text,
          });
        }
      });
      return btns;
    },
    handleAttachDevices(record: any) { // 编辑关联设备
      setDeviceModalData({
        visible: true,
        type: 2, // 1 新增 2 编辑
        flowStoreId: null, // 编辑时不需要
        sourceName: sourceName,
        detail,
        deviceData: record,
      });
    },
    handleDeleteDevices(record: any) {
      V2Confirm({
        content: `确定删除 ${record.name}?`,
        async onSure() {
          const success = await postFlowDeviceDelete({ id: record.id });
          if (success) {
            message.success('删除成功');
            success && tableRef.current.onload(true);
          }
        }
      });
    }
  });

  return (
    <>
      <Table
        ref={ tableRef }
        columns={columns}
        onFetch={methods.fetchData}
        filters={params}
        className={cs(styles.tableList, 'mt-12')}
        rowKey='id'
        pageSize={20}/>
      <DeviceModal data={deviceModalData} setData={setDeviceModalData} onChange={() => tableRef.current.onload(true)}/>
    </>
  );
};

export default DeviceList;
