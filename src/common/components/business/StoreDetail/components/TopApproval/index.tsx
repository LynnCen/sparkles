/**
 * @Description 机会点详情-审批信息提示条
 */
import { FC, useState } from 'react';
import IconFont from '@/common/components/IconFont';
import ApprovalRecords from '../ApprovalRecords';
import { useMethods } from '@lhb/hook';
import styles from './index.module.less';
import cs from 'classnames';
import { isDef } from '@lhb/func';

interface TopApprovalProps {
  evaluationId: number; // 点位评估id
  approvalId?: number; // 审批id，审批详情时传递，机会点详情不传
  detail: any; // 机会点详情
  className?: string;
}

// 接口返回审批状态:null未提交 0待处理,1审批通过,2审批拒绝
enum ChancepointApprovalStatus {
  Processing = 0, // 审批中
  Passed = 1, // 已通过
  Rejected = 2, // 已拒绝
}

// 审批状态对应的提示颜色
const StatusMap = new Map([
  [ChancepointApprovalStatus.Processing, { backgroundColor: '#FF861D' }],
  [ChancepointApprovalStatus.Passed, { backgroundColor: '#009963' }],
  [ChancepointApprovalStatus.Rejected, { backgroundColor: '#F53F3F' }],
]);

const TopApproval: FC<TopApprovalProps> = ({
  evaluationId,
  approvalId,
  detail,
  className,
}) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const types: any = [];
  // 审批详情时，点位评估审批、与合同审批无论状态如何必显示，与app处理保持一致
  if (isDef(detail.pointApprovalStatus) || approvalId) {
    types.push({
      name: '点位评估审批',
      status: detail.pointApprovalStatus,
      statusName: detail.pointApprovalStatusName,
    });
  }
  if (isDef(detail.designAdvanceApprovalStatus)) {
    types.push({
      name: '提前设计审批',
      status: detail.designAdvanceApprovalStatus,
      statusName: detail.designAdvanceApprovalStatusName,
    });
  }
  if (isDef(detail.contractApprovalStatus) || approvalId) {
    types.push({
      name: '合同审批',
      status: detail.contractApprovalStatus,
      statusName: detail.contractApprovalStatusName,
    });
  }

  const methods = useMethods({
    jumpAprroveResults() {
      setDrawerVisible(true);
    },
  });

  return (
    <div className={cs(styles.topApproval, className)}>
      <div className={styles.approvalLeft}>
        {Array.isArray(types) && types.map((itm, idx) => (<div key={idx} className={styles.approvalItem}>
          {!!idx && <div className={styles.seprateLine}></div>}
          <span className='fs-14 c-666'>{itm.name}</span>
          <span className={cs(styles.point, 'ml-12')} style={StatusMap.get(itm.status) || {}}></span>
          <span className='fs-14 c-132 ml-3'>{itm.statusName}</span>
        </div>))}
      </div>
      <div className={styles.cursorPointer} onClick={methods.jumpAprroveResults}>
        <span className='fs-12 c-006 pl-4 pr-4'>查看详细信息</span>
        <IconFont iconHref='iconarrow-right' className='fs-10 c-006' />
      </div>
      <ApprovalRecords relationId={evaluationId} approvalId={approvalId} open={drawerVisible} setOpen={setDrawerVisible} />
    </div>
  );
};

export default TopApproval;
