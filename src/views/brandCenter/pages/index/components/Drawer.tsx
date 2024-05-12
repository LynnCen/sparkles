import { FC, useRef, useEffect, useState } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import DetailMain from './Detail';

/*
  品牌库详情抽屉
*/
interface DrawerProps {
  id: number; // 品牌id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  onRefresh: Function; // 刷新列表
  onReset: Function; // 刷新列表,并跳转至第一页
}

const Drawer: FC<DrawerProps> = ({
  id,
  open,
  setOpen,
  onRefresh,
  onReset,
}) => {
  const drawerWrapper: any = useRef();
  const detailRef: any = useRef();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const target = drawerWrapper.current.getBodyElement();
        target && setContainer(drawerWrapper.current.getBodyElement());
      }, 0);

      detailRef.current.onload();
    }
  }, [open]);

  return (
    <V2Drawer onRef={drawerWrapper} open={open} onClose={() => setOpen(false)}>
      <DetailMain ref={detailRef} id={id} container={container} onRefresh={onRefresh} onReset={onReset} setOpen={setOpen} />
    </V2Drawer>
  );
};

export default Drawer;
