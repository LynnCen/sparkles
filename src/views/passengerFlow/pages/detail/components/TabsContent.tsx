import { FC } from 'react';
import { Tabs, Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { StoreDetail, DeviceStatus, PermissionEvent } from '../ts-config';
import styles from '../entry.module.less';
import Execute from './Execute/index';
import Tenants from './Tenants';
import Records from './Records';
interface TabsContentProps {
  detail: StoreDetail | null;
  onChange: Function;
  deviceParams: any;
  source: string;
  setSource: Function;
}

const TabsContent: FC<TabsContentProps> = ({
  detail,
  onChange,
  deviceParams,
  source,
  setSource
}) => {
  const tabItems: any = () => {
    const tabDevices = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_DEVICES);
    const tabTenantns = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_DEVICES);
    const tabHistory = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_HISTORY);

    const items: any = [];
    !!tabDevices && items.push({
      key: '1',
      label: (
        <span>客流实施
          {
            detail?.deviceStatus === DeviceStatus.ONLINE || !detail?.deviceStatus ? ''
              : <Tooltip title='设备存在异常？'>
                <ExclamationCircleFilled className={styles.tabbarIcon}/>
              </Tooltip>
          }
        </span>
      ),
      children: (detail ? <Execute deviceParams={deviceParams} source={source} setSource={setSource} detail={detail} onChange={onChange}/> : <></>),
    });

    !!tabTenantns && items.push({
      key: '2',
      label: '可见范围',
      children: <Tenants detail={detail}/>,
    });

    !!tabHistory && items.push({
      key: '3',
      label: '操作记录',
      children: <Records detail={detail}/>,
    });

    return items;
  };

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        defaultActiveKey='1'
        items={tabItems()}
      />
    </div>
  );
};

export default TabsContent;
