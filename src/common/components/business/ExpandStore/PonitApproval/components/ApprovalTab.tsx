/**
 * @Description 标准版本-适配机会点详情的 审批状态条
 */

import { FC, useState } from 'react';
import IconFont from '@/common/components/IconFont';
import { useMethods } from '@lhb/hook';
import styles from '../index.module.less';
import cs from 'classnames';
import ApprovalRecords from '../../../StoreDetail/components/ApprovalRecords';
import { StatusMap } from '../enum';

interface ApprovalTabProps {
  /** 点位评估id */
  id: number;
  /** 点位审批状态简略信息 */
  briefDetail: any;
  /** 样式 */
  className?: string;
}

const ApprovalTab: FC<ApprovalTabProps> = ({
  id,
  briefDetail,
  className,
}) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 审批节点抽屉是否可见

  const methods = useMethods({

    /**
   * @description 跳转
   */
    jumpAprroveResults() {
      setDrawerVisible(true);
    },
  });

  return (
    <div className={cs(styles.topApproval, className)}>
      <div className={styles.approvalLeft}>
        {Array.isArray(briefDetail) && briefDetail.map((itm, idx) => (<div key={idx} className={styles.approvalItem}>
          {!!idx && <div className={styles.seprateLine}></div>}
          <span className='fs-14 c-666'>{itm.approvalTypeValueName}</span>
          <span className={cs(styles.point, 'ml-12')} style={StatusMap.get(itm.approvalStatus) || {}}></span>
          <span className='fs-14 c-132 ml-3'>{itm.approvalStatusName}</span>
        </div>))}
      </div>
      <div className={styles.cursorPointer} onClick={methods.jumpAprroveResults}>
        <span className='fs-12 c-006 pl-4 pr-4'>查看详细信息</span>
        <IconFont iconHref='iconarrow-right' className='fs-10 c-006' />
      </div>
      <ApprovalRecords
        relationId={id}
        open={drawerVisible}
        setOpen={setDrawerVisible} />
    </div>
  );
};

export default ApprovalTab;
