/**
 * @Description 显示所有审批节点的抽屉
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { ApprovalNodeStatus } from '../../../ts-config';
import { APPROVE_STATUS_ENUMS } from '@/views/expandstore/pages/approver/ts-config';
import { Badge } from 'antd';
// import cs from 'classnames';
import styles from '../../index.module.less';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Container from '@/common/components/Data/V2Container';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Empty from '@/common/components/Data/V2Empty';
// import CreatorItem from './components/CreatorItem';
import V2LogRecord from '@/common/components/SpecialBusiness/V2LogRecord';
import NodeItem from './components/NodeItem';

const NodesDrawer: FC<any> = ({
  open,
  setOpen,
  nodes,
  detail = {},
}) => {
  const [nodeItems, setNodeItems] = useState<any[]>([]);
  // 审批节点状态
  // const getNodeStatusClass = (status: number) => {
  //   let className = '';
  //   switch (status) {
  //     case ApprovalNodeStatus.Process:
  //       className = '';
  //       break;
  //     case ApprovalNodeStatus.Approved:
  //       className = 'c-006';
  //       break;
  //     case ApprovalNodeStatus.Denied:
  //       className = 'c-f23';
  //       break;
  //     case ApprovalNodeStatus.Reject:
  //       className = 'c-f23';
  //       break;
  //   }
  //   return className;
  // };

  const getNodeStatusColor = (status: number) => {

    let color = '#006aff';
    switch (status) {
      case APPROVE_STATUS_ENUMS.WAITING_DISPOSE:
        color = '#FF861D';
        break;
      case APPROVE_STATUS_ENUMS.APPROVE_ACCESS:
        color = '#009963';
        break;
      case APPROVE_STATUS_ENUMS.APPROVE_REFUSE:
        color = '#f23030';
        break;
      case APPROVE_STATUS_ENUMS.APPROVE_REVOCATION:
        color = '#999';
        break;
      case APPROVE_STATUS_ENUMS.APPROVE_REJECT:
        color = '#f23030';
        break;
    }
    return color;
  };


  const showNodes = useMemo(() => {
    if (isArray(nodes) && nodes.length) {
      const len = nodes.length;
      const targetNodes: any[] = [];
      for (let i = 0; i < len; i++) {
        const nodeItem = nodes[i];
        targetNodes.push(nodeItem);
        const { status } = nodeItem;
        // 节点状态处于审核拒绝时
        if (status === ApprovalNodeStatus.Denied) break;
      }
      return targetNodes;
    }
    return [];
  }, [nodes]);

  /**
   * @description 是否显示审批发起人结点
   */
  const showCreatorNode = useMemo(() => {
    return (isNotEmptyAny(detail) && detail.creator && detail.createdAt);
  }, [detail]);

  useEffect(() => {
    const items: any = [];
    if (showCreatorNode) { // 发起节点
      items.push({
        name: '发起人',
        status: 'finish',
        description: <NodeItem node={{
          name: detail?.creator,
          operators: [
            {
              operateAt: detail?.createdAt,
              employeeName: detail?.creator,
              reason: detail?.applyReason,
            }
          ],
          isStart: true
        }}/>
      });
    }
    if (isArray(showNodes) && showNodes.length) {
      showNodes.forEach((item: any) => {
        items.push({
          name: <>
            {item?.name}
            {/* 审批类型 1 会签 2 或签  操作人数大于1个人时显示标签 */}
            {
              isArray(item?.operators) && item?.operators?.length > 1 ? <span className={styles.tagCon}>{item?.approveType === 1 ? '依次审批' : '任一审批'}</span> : <></>
            }
          </>,
          status: 'finish',
          description: <NodeItem node={item}/>
        });
      });
    }
    setNodeItems(items);
  }, [showCreatorNode, showNodes]);

  return (
    <V2Drawer
      open={open}
      onClose={setOpen}
      className={styles.approvalNodesDrawer}>
      <V2Container
        style={{ height: 'calc(100vh - 48px)' }}
        extraContent={{
          top: <V2Title text='审批结果'/>
        }}
      >
        {/* {showCreatorNode ? <div>
          <V2Title
            divider
            type='H2'
            text='发起审批'
            className='mt-32'
          />
          <CreatorItem detail={detail}/>
        </div> : <></>}
        {
          showNodes.map((node: any) => (
            <div
              key={node.id}>
              <V2Title
                divider
                type='H2'
                text={node.name}
                className='mt-32'
                extra={
                  <div className={cs(getNodeStatusClass(node.status), 'fn-14')}>
                    审批状态：{node.statusName}
                  </div>
                }/>
              <OperatorItem node={node}/>
            </div>))
        } */}
        <V2Title divider className='mt-20 mb-20'>
          <div className='bold fs-16 pr-16'>审批状态</div>
          <Badge dot color={getNodeStatusColor(detail?.status)}/>
          <div className='c-222 fs-14 pl-4'>{detail?.statusName}</div>
        </V2Title>
        {/* <V2Title divider className='mt-10'>
          <div className='fs-16 bold'>审批流程</div>
        </V2Title> */}
        <V2LogRecord items={nodeItems}/>
        {
          (showNodes?.length === 0 && !showCreatorNode) ? <V2Empty centerInBlock/> : <></>
        }
      </V2Container>
    </V2Drawer>
  );
};

export default NodesDrawer;
