import { FC, useState, useEffect } from 'react';
import styles from './entry.module.less';
import V2Container from '@/common/components/Data/V2Container';
import BusinessComplain from './components/BusinessComplain';
import V2Tabs from '@/common/components/Data/V2Tabs';
import CorrectResourceError from './components/CorrectResourceError';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { useLocation } from 'react-router-dom';
import { refactorSelectionNew } from '@/common/utils/ways';
import { FeedbackTabs } from './ts-config';
import NotFound from '@/common/components/NotFound';

const Feedback: FC<any> = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>('');
  const [activeValue, setActiveValue] = useState(null);

  const [tabs, setTabs] = useState<any>([]);
  const location = useLocation();
  const tabMap = {
    'problemFeedback:businessComplaint': 1, // 业务投诉
    'problemFeedback:resourceErrorCorrection': 2, // 资源纠错
  };

  const methods = useMethods({
    onTabChange(activeKey: string) {
      setActiveKey(activeKey);
      setActiveValue(tabMap[activeKey]);
    },
    getTabs() {
      // https://yapi.lanhanba.com/project/307/interface/api/60528/
      post('/saas/advice/listTabs', {}, { isMock: false, mockId: 307, proxyApi: '/lcn-api' }).then(res => {
        const tempArr = Array.isArray(res) && res.length ? refactorSelectionNew({ selection: res }).map(item => ({ key: item.encode, label: item.name })) : [];
        setTabs(tempArr);
        setActiveKey(Array.isArray(tempArr) && tempArr.length ? tempArr[0].key : null);
        setActiveValue((Array.isArray(tempArr) && tempArr.length ? tabMap[tempArr[0].key] : null));
      });
    }
  });

  useEffect(() => {
    if (location.pathname.includes('feedback')) {
      methods.getTabs();
    }
  }, [location]);


  return (
    <div className={styles.container}>
      {Array.isArray(tabs) && tabs.length ? <V2Container
        style={{ height: 'calc(100vh - 104px)' }}
        extraContent={{
          top: <V2Tabs items={tabs} activeKey={activeKey} onChange={methods.onTabChange}/>
        }}
      >
        <div>
          {activeKey === FeedbackTabs.BUSINESS_COMPLAIN && <BusinessComplain mainHeight={'calc(100vh - 194px)'} activeValue={activeValue}/>}
          {activeKey === FeedbackTabs.CORRECT_RESOURCE_ERROR && <CorrectResourceError mainHeight={'calc(100vh - 194px)'} activeValue={activeValue}/>}
        </div>
      </V2Container> : <NotFound></NotFound>}
    </div>
  );
};

export default Feedback;
