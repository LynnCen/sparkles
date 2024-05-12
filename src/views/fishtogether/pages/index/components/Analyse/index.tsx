import { FC, useState } from 'react';
import CompletionTable from './components/CompletionTable';
import { useNavigate } from 'react-router-dom';
import V2Container from '@/common/components/Data/V2Container';
import { useMethods } from '@lhb/hook';
import V2Title from '@/common/components/Feedback/V2Title';

const Analyse: FC<any> = ({ statisticData }) => {
  const navigate = useNavigate();
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [curTab, setCurTab] = useState<any>('1');

  const methods = useMethods({
    jumpMore() {
      navigate('/fishtogether/devdptkpireport');
    },
    changeTab(val) {
      setCurTab(val);
    },
  });

  return (
    <V2Container
      style={{ height: 'calc(100vh - 28px)', maxHeight: curTab === '1' ? '560px' : '424px', background: '#fff' }}
      className='mt-12 pl-16 pr-16 pt-16 pb-16'
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top: (
          <>
            <V2Title
              className='mb-16'
              divider
              type='H2'
              extra={
                <span className='rt color-primary-operate mb-12' onClick={() => methods.jumpMore()}>
                  查看更多
                </span>
              }
            >
              <span className='bold ml-5'>各区域完成情况</span>
            </V2Title>
          </>
        ),
      }}
    >
      <CompletionTable mainHeight={mainHeight} statisticData={statisticData} />
    </V2Container>
  );
};

export default Analyse;
