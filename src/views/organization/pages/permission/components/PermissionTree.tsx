/* 权限树 */
import React, { FC } from 'react';
import { Tree, Empty } from 'antd';
import { PermissionTreeProps } from '../ts-config';

const PermissionTree: FC<PermissionTreeProps> = ({
  treeData,
  expandedKeys,
  changeExpandedKeys,
  checkedKeys,
  changeCheckedKeys,
  fieldNames = { title: 'name', key: 'id', children: 'children' },
  changeHalfParentIds,
}) => {
  // 展开
  const onExpand = (expandedKeysValue: React.Key[]) => {
    changeExpandedKeys(expandedKeysValue);
  };

  // 选择
  const onCheck = (checkedKeysValue: any, e: any) => {
    const halfChecked = e.halfCheckedKeys;
    // // 半选-单独存一下父节点id
    changeHalfParentIds && halfChecked && changeHalfParentIds(halfChecked || []);
    changeCheckedKeys('check', checkedKeysValue);
  };

  return (
    <>
      {treeData.length === 0 ? (
        <Empty />
      ) : (
        <Tree
          showIcon
          checkable
          onExpand={onExpand}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={onCheck}
          treeData={treeData}
          // className={styles.treeWrap}
          fieldNames={fieldNames}
        />
      )}
    </>
  );
};

export default PermissionTree;
