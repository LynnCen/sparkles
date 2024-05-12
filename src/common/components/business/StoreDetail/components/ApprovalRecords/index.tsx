/**
 * @Description 机会点详情-弹出的审批流水记录抽屉
 */
import { FC, useRef, useEffect } from 'react';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import Detail from './Detail';

/*
  审批流水记录抽屉
*/
interface DrawerProps {
  relationId: number; // 点位评估id
  approvalId?: number; // 审批id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
}

const ApprovalRecords: FC<DrawerProps> = ({
  relationId,
  approvalId, // 审批id
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
      <Detail ref={detailRef} relationId={relationId} approvalId={approvalId}/>
    </V2Drawer>
  );
};

export default ApprovalRecords;
