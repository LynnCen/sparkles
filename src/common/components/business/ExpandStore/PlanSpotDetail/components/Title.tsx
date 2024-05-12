/**
 * @Description 集客点审批-顶部
 */
import { FC, useState } from 'react';
import styles from '../index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import cs from 'classnames';
import { APPROVE_STATUS_ENUMS } from '@/views/expandstore/pages/approver/ts-config';
import NodesDrawer from '../../ApprovalNodes/components/NodesDrawer';
import IconFont from '@/common/components/IconFont';


// 状态颜色
const statusColor = {
  [APPROVE_STATUS_ENUMS.WAITING_DISPOSE]: '#006AFF',
  [APPROVE_STATUS_ENUMS.APPROVE_ACCESS]: '#009963',
  [APPROVE_STATUS_ENUMS.APPROVE_REFUSE]: '#F53F3F',
  [APPROVE_STATUS_ENUMS.APPROVE_REJECT]: '#FF861D',
};

const Title: FC<any> = ({
  aprDetail, // 审批详情
  planSpotsCount, // 审批集客数
}) => {

  const [nodesDrawer, setNodesDrawer] = useState<any>({
    open: false,
  });

  return (
    <div className={styles.detailTop}>
      <div className={styles.approvalContain}>
        <V2DetailItem
          label='提交人：'
          direction='horizontal'
          value={aprDetail.creator}
          className={styles.item}
        />
        <V2DetailItem
          label='提交时间：'
          direction='horizontal'
          className={styles.item}
          value={aprDetail.createdAt || '-'}
        />
        <V2DetailItem
          label='审批集客点数：'
          direction='horizontal'
          className={styles.item}
          labelLength={6}
          value={planSpotsCount || '-'}
        />
        <V2DetailItem
          label='审批状态：'
          className={styles.item}
          direction='horizontal'
          value={
            <>
              <span
                className={styles.statusIcon}
                style={{
                  backgroundColor: statusColor[aprDetail.status],
                }}
              />
              {aprDetail.statusName || '-'}
              <span
                className={cs('c-006 rt ml-12', styles.more)}
                onClick={() => setNodesDrawer((state) => ({ ...state, open: true }))}
              >
              查看全部审批结果
                <IconFont iconHref='iconarrow-right' className={styles.scaleIcon}/>
              </span>
            </>
          }
        />
      </div>
      <div className={styles.reasonCon}>
        <span className={styles.reason}>理由说明：</span>
        {aprDetail.preApproveReason || '-'}
      </div>

      <NodesDrawer
        detail={aprDetail}
        nodes={aprDetail?.nodes || []}
        open={nodesDrawer.open}
        setOpen={setNodesDrawer}/>
    </div>
  );
};

export default Title;
