import { FC, useEffect, useState, } from 'react';
import BrandInfo from './components/BrandInfo/BrandInfo';
import CustomerInfo from './components/CustomerInfo/CustomerInfo';
import MarketInfo from './components/MarketInfo/MarketInfo';
// import SynthesisInfo from './components/SynthesisInfo/SynthesisInfo';
import styles from './entry.module.less';
import { tenantCheck } from '@/common/api/common';
import V2Container from '@/common/components/Data/V2Container';
import V2Tabs from '@/common/components/Data/V2Tabs';

const IndustryMap: FC<any> = () => {
  // 让Tabs切换的重新刷新内容
  const [tabsKey, setTabsKey] = useState<string>('BrandInfo');
  // babyCare Demo判断
  const [isDemo, setIsDemo] = useState<boolean>(false);
  useEffect(() => {
    tenantCheck()
      .then(res => {
        if (res && res.isBabyCare) setIsDemo(true);
      });
  }, []);
  const tabChildCom = () => {
    switch (tabsKey) {
      case 'BrandInfo':
        return <BrandInfo />;
      case 'MarketInfo':
        return <MarketInfo />;
      case 'CustomerInfo':
        return <CustomerInfo />;
      default:
        return '';
    }
  };
  const items = [
    { key: 'BrandInfo', label: '重点品牌关注信息' },
    { key: 'MarketInfo', label: '重点商圈信息' },
    { key: 'CustomerInfo', label: isDemo ? '客群信息' : '' },
  ];
  return (
    <div className={styles.container}>
      <V2Container
        className={styles.demoA}
        style={{ height: 'calc(100vh - 120px)' }}
        extraContent={{
          top: <>
            <V2Tabs
              items={items}
              onChange={(key) => setTabsKey(key)}
              tabBarExtraContent={{
                // right: <Button type='primary'>改变top的高度</Button>
              }}/>
          </>,
        }}>
        {
          tabChildCom()
        }
      </V2Container>
      {/* <Tabs defaultActiveKey='1' size='large' onChange={(key) => setTabsKey(key)}>
        <Tabs.TabPane tab='重点品牌关注信息' key='1'>
          {tabsKey === '1' && <BrandInfo />}
        </Tabs.TabPane>
        <Tabs.TabPane tab='重点商圈信息' key='2'>
          {tabsKey === '2' && <MarketInfo />}
        </Tabs.TabPane> */}
      {/* <Tabs.TabPane tab='商场综合体信息' key='3'>
          <SynthesisInfo/>
        </Tabs.TabPane> */}
      {/* {isDemo && <Tabs.TabPane tab='客群信息' key='4'>
          {tabsKey === '4' && <CustomerInfo />}
        </Tabs.TabPane>}
      </Tabs> */}
    </div>
  );
};

export default IndustryMap;
