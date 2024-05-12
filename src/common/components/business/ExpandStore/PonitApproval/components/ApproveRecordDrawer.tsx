/**
 * @Description 标准版本-机会点详情-弹出的审批流水记录抽屉
 */
import { FC, useRef, useEffect } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from './ApproveRecord';

/*
  审批流水记录抽屉
*/
interface DrawerProps {
  relationId: number; // 点位评估id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
}

const ApprovalRecords: FC<DrawerProps> = ({
  relationId,
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
      <Detail
        ref={detailRef} relationId={relationId}/>
    </V2Drawer>
  );
};

export default ApprovalRecords;
