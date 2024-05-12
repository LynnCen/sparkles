/**
 * @Description 审批人
 * 注意nodes里有会签和或签的逻辑
 * approveType 审批类型 1 会签 2 或签 注意会签时显示所有审批人的信息
 */

import { FC, useMemo } from 'react';
import { Row, Col } from 'antd';
import { isArray } from '@lhb/func';
import { ApprovalNodeOperatorStatus } from '../../../../ts-config';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

const OperatorItem: FC<any> = ({
  node
}) => {

  const showNodes = useMemo(() => {
    const { approveType, operators } = node;
    if (!(isArray(operators) && operators.length)) return [];
    // approveType 审批类型 1 会签 2 或签 注意会签时显示所有审批人的信息
    if (approveType === 1) {
      // 如果有其中一个审批人进行了拒绝的操作，后续操作人都不显示
      const showOperators: any[] = [];
      const len = operators.length;
      for (let i = 0; i < len; i++) {
        const operatorItem: any = operators[i];
        showOperators.push(operatorItem);
        const { status } = operatorItem;
        // 节点状态处于审核拒绝时
        if (status === ApprovalNodeOperatorStatus.Denied) break;
      }
      return showOperators;
    } else if (approveType === 2) {
      // 查找谁审批通过的
      const target = operators.find((item: any) => item.status === ApprovalNodeOperatorStatus.Approved || item.status === ApprovalNodeOperatorStatus.Denied);
      if (target) return [target];
      // 如果没有审批通过的，那就显示所有
      return operators;
    }
    return [];
  }, [node]);
  return (
    <>
      {
        showNodes.map((nodeItem: any) => (<div key={nodeItem.employeeId}>
          <Row gutter={20}>
            <Col span={8}>
              <V2DetailItem label='审批人' value={nodeItem?.employeeName} />
            </Col>
            <Col span={8}>
              <V2DetailItem label='审批时间' value={nodeItem?.operateAt} />
            </Col>
            <Col span={8}>
              <V2DetailItem label='审批意见' value={nodeItem?.reason} />
            </Col>
          </Row>
        </div>))
      }
    </>
  );
};

export default OperatorItem;
