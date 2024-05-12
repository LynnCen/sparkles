import { FC, useState } from 'react';
import { Button, message } from 'antd';
import { CloseCircleFilled, SyncOutlined } from '@ant-design/icons';
import DeviceList from './components/DeviceList';
import SolutionModal from './components/SolutionModal';
import DeviceModal from './components/DeviceModal';
import NoSetting from '../NoSetting/index';
import { DeviceStatus, SourceValue, StoreDetail, PermissionEvent } from '../../ts-config';
import styles from './index.module.less';
import cs from 'classnames';
import { storeRefresh, postStoreFlowClose } from '@/common/api/passenger-flow';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { replaceEmpty } from '@lhb/func';

interface ExecuteProps {
  detail: StoreDetail | Record<string, any>;
  onChange: Function;
  deviceParams: any;
  source: string;
  setSource: Function;
}

const Execute: FC<ExecuteProps> = ({ detail, onChange, deviceParams, source, setSource }) => {
  const [solutionModalData, setSolutionModalData] = useState<any>({
    visible: false,
    type: 1, // 1 开通 2 切换
  });
  const [deviceModalData, setDeviceModalData] = useState<any>({
    visible: false,
    type: 1, // 1 新增 2 编辑
    flowStoreId: null,
    sourceName: '',
    detail,
    deviceData: null,
  });
  const handleRefresh = () => {
    const sucess = storeRefresh({ id: detail.id });
    if (sucess) {
      // 延迟刷新，立刻刷新取到到的时候还是变更前的
      setTimeout(() => {
        onChange();
      }, 500);
    }
  };

  const handleClose = () => {
    V2Confirm({
      title: '关闭',
      content: `确定关闭【${detail.sourceName}】客流方案吗？`,
      onSure: async () => {
        const success = await postStoreFlowClose({ storeId: detail.id });
        if (success) {
          message.success('关闭成功');
          onChange();
        }
      }
    });
  };

  const handleSwitch = () => {
    setSolutionModalData({
      visible: true,
      type: 2, // 1 开通 2 切换
      detail,
    });
  };

  const handleRelateDevice = () => { // 新增关联设备
    setDeviceModalData({
      visible: true,
      type: 1, // 1 新增 2 编辑
      flowStoreId: detail.flowStoreId,
      sourceName: detail.sourceName,
      detail,
      deviceData: null,
    });
  };

  const handleOpen = () => { // 开通客流
    setSolutionModalData({
      visible: true,
      type: 1, // 1 开通 2 切换
      detail,
    });
  };

  const permissionOpen = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.OEPN);
  const permissionChange = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.CHANGE);
  const permissionClose = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.CLOSE);
  const permissionAttachDevice = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.DEVICE_ATTACH);

  return (
    <div className={styles.excuteWrapper}>
      {
        !source && <NoSetting text={`尚未设置${permissionOpen ? '，' : ''}`} clickText={permissionOpen ? '立即开通客流' : ''} onOpen={handleOpen}/>
      }
      <div style={{
        display: source ? 'block' : 'none'
      }}>
        {
          detail.deviceStatus === DeviceStatus.OFFLINE && (
            <div className={styles.warningBar}>
              <div className={styles.offline}>
                <CloseCircleFilled className={styles.offlineIcon}/>
                <span className={styles.offlineText}>设备离线</span>
              </div>
              <div className={styles.refresh} onClick={handleRefresh}>
                <SyncOutlined className={styles.refreshIcon}/>
                <span className={styles.refreshText}>刷新</span>
              </div>
            </div>
          )
        }
        <div className={styles.infoBar}>
          <span className={styles.source}>解决方案:{detail.sourceName}</span>
          {
            source === SourceValue.YD || source === SourceValue.HN ? <span className='ml-16'>门店名：{detail.flowStoreName}</span> : ''
          }
          <span className={cs(styles.device, 'ml-16')}>NVR:{detail.nvr || '-'}</span>
          {
            source === SourceValue.YD ? <span className='ml-16'>人次分段统计值：{replaceEmpty(detail.duration)}s</span> : ''
          }
          {
            permissionClose && <Button className='ml-24' onClick={handleClose}>关闭</Button>
          }
          {
            permissionChange && <Button className={cs(styles.higlightButton, 'ml-12')} onClick={handleSwitch}>切换方案</Button>
          }
        </div>
        {
          <div style={{
            display: source !== SourceValue.HN ? 'block' : 'none'
          }}>
            <div className={cs(styles.guideBar, 'mt-16')}>
              <span className={styles.guideText}>请按照提示，配置{detail.sourceName}客流设备：</span>
              {
                permissionAttachDevice && source === SourceValue.HW && <Button className={styles.higlightButton} onClick={handleRelateDevice}>关联设备</Button>
              }
            </div>
            <DeviceList params={deviceParams} detail={detail} storeId={detail.id} sourceName={detail.sourceName} />
          </div>
        }
      </div>
      <SolutionModal data={solutionModalData} setData={setSolutionModalData} setSource={setSource} onChange={onChange} />
      <DeviceModal data={deviceModalData} setData={setDeviceModalData} onChange={onChange}/>
    </div>
  );
};

export default Execute;
