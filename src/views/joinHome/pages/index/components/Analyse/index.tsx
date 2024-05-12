import { FC, useState } from 'react';
import styles from '../../entry.module.less';
import CompletionTable from './components/CompletionTable';
import PromotionProjectsTable from './components/PromotionProjectsTable';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { useNavigate } from 'react-router-dom';
import V2Container from '@/common/components/Data/V2Container';
import { useMethods } from '@lhb/hook';

const items = [
  { label: '各区域完成情况', key: '1' },
  { label: '重点推进项目', key: '2' },
];

const Analyse: FC<any> = () => {
  const navigate = useNavigate();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [curTab, setCurTab] = useState<any>('1');

  const methods = useMethods({
    jumpMore() {
      navigate('/storemanage/expandtaskmng');
    },
    changeTab(val) {
      setCurTab(val);
    }
  });

  return <V2Container
    style={{ height: 'calc(100vh - 28px)', maxHeight: curTab === '1' ? '560px' : '424px', background: '#fff' }}
    className='mt-12 pl-16 pr-16'
    emitMainHeight={(h) => setMainHeight(h)}
    extraContent={{
      top: <>
        <V2Tabs
          items={items}
          activeKey={curTab}
          tabBarExtraContent={{
            right: <div className='rt color-primary-operate mb-12' onClick={() => methods.jumpMore()}>
              查看更多
            </div>
          }}
          className={styles.tabsCon}
          onChange={methods.changeTab}
        />
      </>,
    }}>
    <>
      {curTab === '1' && <CompletionTable mainHeight={mainHeight}/>}
      {curTab === '2' && <PromotionProjectsTable mainHeight={mainHeight}/>}
    </>
  </V2Container>;
};

export default Analyse;
