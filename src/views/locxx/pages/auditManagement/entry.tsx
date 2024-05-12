import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Container from '@/common/components/Data/V2Container';
import { useMethods } from '@lhb/hook';
import Project from './components/Project';
import Brand from './components/Brand';


// 交易平台-审核管理-品牌
const AuditManagement:FC<any> = () => {
  const AUDIT_TYPE_PROJECT = '1';// 项目
  const AUDIT_TYPE_BRAND = '2';// 品牌

  const [activeKey, setActiveKey] = useState<string>('1');
  const tabs = [{ label: '项目', key: '1' }, { label: '品牌', key: '2' }];

  const methods = useMethods({
    tabChange(key:string) {
      setActiveKey(key);
    },
  });

  return <div className={styles.container}>
    <V2Container
      style={{ height: 'calc(100vh - 104px)' }}
      extraContent={{
        top: <>
          <V2Tabs activeKey={activeKey} items={tabs} onChange={methods.tabChange}/>
        </>
      }}
    >
      <div>
        {activeKey === AUDIT_TYPE_PROJECT && <Project mainHeight={'calc(100vh - 194px)'}/>}
        {activeKey === AUDIT_TYPE_BRAND && <Brand mainHeight={'calc(100vh - 194px)'}/>}
      </div>
    </V2Container>
  </div>;
};

export default AuditManagement;
