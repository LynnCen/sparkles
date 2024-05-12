import { Tabs } from 'antd';
import { FC, useState } from 'react';
import TabContent from './components/TabContent';
import styles from './entry.module.less';
import { ResourceType } from './ts-config';
import { KeepAlive } from 'react-activation';

const Category: FC<any> = () => {
  /* data */
  const [activeKey, setActiveKey] = useState('0');
  const [resourceType, setResourceType] = useState(ResourceType.PLACE);

  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <Tabs
            activeKey={activeKey}
            onTabClick={(key) => {
              setActiveKey(key);
              setResourceType(Number(key));
            }}
            items={[
              { label: '场地', key: '0' },
              { label: '点位', key: '1' },
            ]}
          />
          <div className={styles.tab}>
            <TabContent resourceType={resourceType} />
          </div>
        </div>
      </div>
    </KeepAlive>
  );
};

export default Category;
