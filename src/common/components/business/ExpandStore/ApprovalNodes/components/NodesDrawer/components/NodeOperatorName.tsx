/**
 * @Description 审批节点名字
 */
import { FC, useMemo } from 'react';
import { ApprovalNodeOperatorStatus } from '@/common/components/business/ExpandStore/ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const NodeOperatorName: FC<any> = ({
  node,
  name,
  operator
}) => {
  const { isStart } = node;
  const { status } = operator;
  // 发起节点 || 审核通过
  const isPass = useMemo(() => {
    if (isStart) return isStart;
    return status === ApprovalNodeOperatorStatus.Approved;
  }, [isStart, status]);
  // 拒绝
  const isDenied = useMemo(() => {
    return status === ApprovalNodeOperatorStatus.Denied;
  }, [status]);
  // 驳回
  const isReject = useMemo(() => {
    return status === ApprovalNodeOperatorStatus.Reject;
  }, [status]);

  const bg = useMemo(() => {
    if (status === ApprovalNodeOperatorStatus.Process) return '#DDDDDD';
    return '#006aff';
  }, [isPass, isDenied, isReject, status]);

  return (
    <div
      className={cs('', styles.nameCon)}
      style={{
        background: bg
      }}
    >
      {name?.substring(0, 1)}
      {
        status === ApprovalNodeOperatorStatus.Process ? <></> : <div
          className={styles.statusBadge}
          style={{
            background: isDenied || isReject ? '#f23030' : ''
          }}>
          {
            isPass && <IconFont iconHref='iconselect' className={cs(styles.scaleIcon, 'color-white')}/>
          }
          {
            isDenied && <IconFont iconHref='iconic-closexhdpi' className={cs(styles.scaleIcon, 'color-white')}/>
          }
          {
            isReject && <IconFont iconHref='icon-ui-lib-chehui' className={cs(styles.scaleIcon, 'color-white')}/>
          }
        </div>
      }
    </div>
  );
};

export default NodeOperatorName;
