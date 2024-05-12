import { FC } from 'react';

import StartNode from './Start';
import ApproverNode from './Approver';
import ConditionNode from './Condition';

const NodeMaps: any = {
  0: StartNode,
  1: ApproverNode,
  3: ConditionNode
};

const MatchNode: FC<any> = ({ config, pRef }) => {
  const Node = NodeMaps[config.type] || null;
  return Node && <Node {...config} objRef={config} pRef={pRef} />;
};

export default MatchNode;
