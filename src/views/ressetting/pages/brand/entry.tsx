import { Tabs } from 'antd';
import { FC } from 'react';
import TabContent from './components/TabContent';
import styles from './entry.module.less';
import { BrandType } from './ts-config';
import { KeepAlive } from 'react-activation';

const Brand: FC<any> = () => {
  /* data */
  return (
    <KeepAlive saveScrollPosition>
      <div className={styles.container}>
        <div className={styles.content}>
          <Tabs defaultActiveKey='1' destroyInactiveTabPane={true} items={[
            { label: '买家品牌', key: '1', children: <TabContent brandType={BrandType.BUYER}/> },
            { label: '供应商品牌', key: '2', children: <TabContent brandType={BrandType.SUPPLER}/> },
            { label: '服务商品牌', key: '3', children: <TabContent brandType={BrandType.SERVICE}/> },
            { label: '其他品牌', key: '4', children: <TabContent brandType={BrandType.OTHER}/> },
          ]}/>
        </div>
      </div>
    </KeepAlive>
  );
};

export default Brand;
