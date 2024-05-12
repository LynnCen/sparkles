import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import MessageNote from './components/MessageNote';
import V2Tabs from '@/common/components/Data/V2Tabs';
import WechatNote from './components/WechatNote';
import { useMethods } from '@lhb/hook';
const items = [
  { key: '1', label: `短信邀请` },
  { key: '2', label: `微信邀请` },
];
const InviteCustomer: FC<any> = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>('1');
  const methods = useMethods({
    onTabChange(activeKey: string) {
      setActiveKey(activeKey);
    }
  });
  return (
    <div className={styles.container}>
      <V2Container
        style={{ height: 'calc(100vh - 104px)' }}
        extraContent={{
          top: <V2Tabs items={items} activeKey={activeKey} onChange={methods.onTabChange}/>
        }}
      >
        {
          activeKey === '1' ? <MessageNote/> : <WechatNote/>
        }
      </V2Container>
    </div>
  );
};

export default InviteCustomer;
