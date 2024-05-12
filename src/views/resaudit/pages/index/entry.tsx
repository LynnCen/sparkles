import { Tabs } from 'antd';
import { FC, useState } from 'react';
import TabContent from './components/TabContent';
import Filters from './components/Filters';
import styles from './entry.module.less';
import { ResourceType, ResourceApprovalType } from './ts-config';
import { KeepAlive } from 'react-activation';

const Manage: FC<any> = () => {
  /* data */
  const [activeKey, setActiveKey] = useState('0');
  const [resourceType, setResourceType] = useState(ResourceType.PLACE);
  const [params, setParams] = useState<any>({ resourceType });
  const [status, setStatus] = useState(ResourceApprovalType.WAIT); // 1: 待审核；2：已通过
  const [waitCount, setWaitCount] = useState(0);

  // 查询/重置
  const onSearch = (filter: any) => {
    setParams({ ...params, ...filter });
  };

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <Tabs
            activeKey={activeKey}
            onTabClick={(key) => {
              if (Number(key) !== resourceType) {
                setActiveKey(key);
                setResourceType(Number(key));
                // 切换场地/点位列表时，默认展示"待审核"状态
                setStatus(ResourceApprovalType.WAIT);
              }
            }}
            items={[
              { label: '场地审核列表', key: '0' },
              { label: '点位审核列表', key: '1' },
            ]}
          />
          <Filters
            resourceType={resourceType}
            status={status}
            waitCount={waitCount}
            onSearch={onSearch}
            onChangeStatus={(val: number) => setStatus(val)}
          />
          <TabContent
            resourceType={resourceType}
            status={status}
            params={{ ...params, status, resourceType }}
            onChangeWaitCount={(val) => setWaitCount(val)}
          />
        </div>
      </div>
    </KeepAlive>
  );
};

export default Manage;
