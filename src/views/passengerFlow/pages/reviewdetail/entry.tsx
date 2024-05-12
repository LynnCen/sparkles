import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import V2Drawer, { V2DrawerHandles } from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import DetailMain from './components/DetailMain';

interface ReviewDetailProps {
  drawerData: {visible: boolean, id: string | number};
  setDrawerData: Function;
}

const ReviewDetail:FC<ReviewDetailProps> = ({
  drawerData,
  setDrawerData
}) => {
  const drawerWrapper: MutableRefObject<V2DrawerHandles | null> = useRef(null);
  const [container, setContainer] = useState<any>(null);

  const onClose = () => {
    setDrawerData({
      ...drawerData,
      visible: false
    });
  };

  useEffect(() => {
    if (drawerData.visible) {
      setTimeout(() => {
        const target = drawerWrapper.current?.getBodyElement();
        target && setContainer(drawerWrapper.current?.getBodyElement());
      }, 0);
    }
  }, [drawerData.visible]);

  return (
    <>
      <V2Drawer
        onRef={drawerWrapper}
        bodyStyle={{
          paddingTop: 30,
        }}
        maskClosable={false}
        destroyOnClose
        open={drawerData.visible}
        onClose={onClose}>
        <V2Container
          // 容器上下padding 32， 所以减去就是64
          style={{ height: 'calc(100vh - 64px)' }}
          extraContent={{

          }}
        >
          <DetailMain id={drawerData.id} drawerContainer={container}/>
        </V2Container>
      </V2Drawer>
    </>
  );
};
export default ReviewDetail;
