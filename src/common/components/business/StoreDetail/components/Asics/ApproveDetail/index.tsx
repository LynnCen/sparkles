/**
 * @Description 审批详情抽屉
 */
import { FC, useRef, useEffect } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from './Detail';

interface DrawerProps {
  id: number; // 拓店调研报告id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
}

const Drawer: FC<DrawerProps> = ({
  id,
  open,
  setOpen,
}) => {
  const detailRef: any = useRef();

  useEffect(() => {
    if (open) {
      detailRef.current.onload();
    }
  }, [open]);

  return (
    <V2Drawer open={open} onClose={() => setOpen(false)}>
      <Detail ref={detailRef} id={id}/>
    </V2Drawer>
  );
};

export default Drawer;
