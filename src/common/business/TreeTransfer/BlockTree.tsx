import { FC } from 'react';
import { Tree } from 'antd';

const TreeTransfer: FC<any> = ({
  treeData,
  checkedKeys,
  setCheckedKeys,
  ...extraPorps
}) => {
  const onCheck = (checkedKeysValue: any, info: any) => {
    console.log('onCheck', checkedKeysValue, info);
    setCheckedKeys(checkedKeysValue);
  };
  return <Tree
    blockNode
    checkable
    defaultExpandAll
    checkedKeys={checkedKeys}
    treeData={treeData}
    onCheck={onCheck}
    selectable={false}
    { ...extraPorps }
  />;
};

export default TreeTransfer;
