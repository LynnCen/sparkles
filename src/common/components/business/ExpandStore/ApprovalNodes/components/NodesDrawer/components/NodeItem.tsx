/**
 * @Description 审批节点item
 */

import { FC } from 'react';
import { isArray } from '@lhb/func';
import { ApprovalNodeOperatorStatus } from '@/common/components/business/ExpandStore/ts-config';
import cs from 'classnames';
import styles from './index.module.less';
import NodeOperatorName from './NodeOperatorName';
import NodeOpinion from './NodeOpinion';

const NodeItem: FC<any> = ({
  node
}) => {
  const { operators } = node;
  // 拒绝 || 驳回
  const isFail = (operatorStatus: any) => {
    return operatorStatus === ApprovalNodeOperatorStatus.Denied || operatorStatus === ApprovalNodeOperatorStatus.Reject;
  };

  return <>
    {/* 遍历操作人 */}
    { isArray(operators) && operators?.length > 0
      ? <>
        {
          operators.map((item: any, index: number) => <div
            key={index}
            className={styles.nodeItemCon}
          >
            {/* 操作人首字及小icon */}
            <NodeOperatorName
              node={node}
              operator={item}
              name={item.employeeName}
            />
            {/* 审批人和审批时间 */}
            <div className={cs(styles.contentCon, 'ml-8')}>
              <div className={cs(
                'c-222 fs-14 bold',
                item?.operateAt ? '' : 'mt-10'
              )}>
                {item?.employeeName}
                {
                  isFail(item?.status)
                    ? <span className='pl-4 c-f23'>{item?.statusName}</span>
                    : null
                }
              </div>
              {/* 操作时间 */}
              {
                item?.operateAt ? <div className='c-666 fs-12'>
                  {item?.operateAt}
                </div> : <></>
              }
              {/* 申请理由 || 审批意见 */}
              {
                item?.reason ? <NodeOpinion
                  textStr={item?.reason}
                  isStart={node?.isStart}
                /> : <></>
              }
            </div>
          </div>)
        }
      </>
      : <></> }
  </>;
};

export default NodeItem;
