import { Tabs } from 'antd';
import { FC, useEffect, useState } from 'react';
import CategoryChooseModal from './components/Modal/CategoryChooseModal';
import TabContent from './components/TabContent';
import styles from './entry.module.less';
import { CategoryChooseModalInfo, ResourceType } from './ts-config';
import { useLocation } from 'react-router-dom';
import { urlParams } from '@lhb/func';
// import { useActivate } from 'react-activation';


const Manage: FC<any> = () => {
  /* data */
  const [categoryChooseModalInfo, setCategoryChooseModalInfo] = useState<CategoryChooseModalInfo>({ visible: false });
  const { search } = useLocation();
  const { activeKey: key } = urlParams(search) as any as { activeKey?: string };
  const [activeKey, setActiveKey] = useState('0');
  const [resourceType, setResourceType] = useState(ResourceType.PLACE);

  useEffect(() => {
    if (!key) {
      return;
    }
    setActiveKey(key);
    setResourceType(Number(key));
  }, [key]);

  // useActivate(() => {
  //   setActiveKey(activeKey);
  // });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Tabs
          activeKey={activeKey}
          onTabClick={(key) => {
            setActiveKey(key);
            setResourceType(Number(key));
          }}
          items={[
            { label: '场地列表', key: '0' },
            { label: '点位列表', key: '1' },
          ]}
        />
        <TabContent
          categoryChooseModalInfo={categoryChooseModalInfo}
          setCategoryChooseModalInfo={setCategoryChooseModalInfo}
          resourceType={resourceType}
          setResourceType={setResourceType}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CategoryChooseModal
          categoryChooseModalInfo={categoryChooseModalInfo}
          setCategoryChooseModalInfo={setCategoryChooseModalInfo}
        />
      </div>
    </div>
  );
};

export default Manage;
