/**
 * @Description 客流详情tab
 */
import { FC } from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { StoreDetail, DeviceStatus, PermissionEvent } from '@/views/passengerFlow/pages/detail/ts-config';
import V2Tabs from '@/common/components/Data/V2Tabs';
import styles from './index.module.less';
interface TabsContentProps {
  detail: StoreDetail | Record<string, any>;
  activeKey: string;
  setActiveKey: Function;
}

const TabsContent: FC<TabsContentProps> = ({
  detail,
  activeKey,
  setActiveKey,
}) => {
  const tabItems: any = () => {
    const tabDevices = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_DEVICES);
    const tabTenants = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_DEVICES);
    const tabHistory = !!(detail && detail.permissionEvents) && detail.permissionEvents.includes(PermissionEvent.TAB_HISTORY);

    const items: any = [];
    !!tabDevices && items.push({
      key: '1',
      label: (
        <span>客流实施
          {
            detail?.deviceStatus === DeviceStatus.ONLINE || !detail?.deviceStatus ? ''
              : <Tooltip title='设备存在异常？'>
                <ExclamationCircleFilled className={styles.tabBarIcon}/>
              </Tooltip>
          }
        </span>
      ),
    });

    !!tabTenants && items.push({
      key: '2',
      label: '可见范围',
    });

    !!tabHistory && items.push({
      key: '3',
      label: '操作记录',
    });

    return items;
  };

  return (
    <V2Tabs
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      items={tabItems()}
    />
  );
};

export default TabsContent;
