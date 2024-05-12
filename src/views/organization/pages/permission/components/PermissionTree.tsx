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
}) => {
  // 展开
  const onExpand = (expandedKeysValue: React.Key[]) => {
    changeExpandedKeys(expandedKeysValue);
  };

  // 选择
  const onCheck = (checkedKeysValue: any, e: any) => {
    changeCheckedKeys('check', checkedKeysValue, e.halfCheckedKeys ? e.halfCheckedKeys : []);
  };

  return (
    <>
      {treeData.length === 0 ? (
        <Empty />
      ) : (
        <Tree
          showIcon
          checkable
          // selectable参数的作用是点击label也能选中复选框
          selectable={false}
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
