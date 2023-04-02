import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { filterAllSelected, convert } from '@/utils/permissionTreeHelper';
import styles from './index.less';


interface PropTypes {
  value?: React.Key[];
  onChange?: (newKeys: React.Key[]) => void;
  onAccessFieldChanged?: (p: string[]) => void;
}


const PermissionTree: React.FC<PropTypes> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  // const [treeData, setTreeData] = useState<TreeNodeNormal[]>([])
  const treeData = convert(props.value || []);

  // trying to get all access here
  // useEffect(() => {
  //   // all access
  //   getAuthMenu().then(res => {    
  //     if (res) {
  //       const [data, err] = res
  //       if (!err && !data.err_code) {
  //         const treeData = convert(data.items)
  //         setTreeData(treeData)
  //       }
  //     }
  //   })
  // }, [])

  useEffect(() => {
    setExpandedKeys(filterAllSelected(treeData));
    setCheckedKeys(filterAllSelected(treeData));
  }, [props.value]);

  // const triggerChange = (newKeys: React.Key[]) => {
  //   onChange?.(newKeys)
  // }

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    
    setCheckedKeys(checkedKeysValue);
    if (props.onAccessFieldChanged) {
      // @ts-ignore
      props.onAccessFieldChanged(checkedKeysValue);
    }
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    // console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  // @ts-ignore
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
      className={styles.permission_tree}
    />
  );
};

export default PermissionTree;
