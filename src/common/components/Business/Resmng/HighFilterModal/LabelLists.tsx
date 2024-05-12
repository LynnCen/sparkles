import type { DataNode } from 'antd/lib/tree';
import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { gatherMethods } from '@lhb/func';
// import { gatherMethods } from '@lhb/func';

const LabelLists: React.FC<{
  typeAllChildrenData: {[key: string | number]: Array<{[key: string | number]: any}>};
  checkedList: React.Key[];
  currentTabCheckedList: React.Key[];
  setCheckedList: any;
  treeData: DataNode[];
  currentTab: string; // 当前tab
}> = ({ checkedList, treeData, setCheckedList, typeAllChildrenData, currentTab, currentTabCheckedList }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  // const [currentTabCheckedList, setCurrentTabCheckedList] = useState<React.Key[]>([]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // 当前tab下的所有的keys
  const currentTabKeys = typeAllChildrenData && typeAllChildrenData[currentTab] ? Object.keys(typeAllChildrenData[currentTab]) : [];

  /**
   * 当选中框选中时候触发
   * @param checked 选中的值包括父级
   * @param param1
   */
  const onCheck = (checked, { checkedNodes }: any) => {
    // console.log('checkedNodes', checked);
    const checkItems = checkedNodes.filter(item => !(item?.children?.length)).map(item => item.key);
    const checkedSet = new Set(gatherMethods(checkedList, currentTabKeys, 2));
    // console.log('checkItems', checkItems);
    checkItems.map(item => checkedSet.add(item));
    // console.log('checkedSet', checkedSet);

    setCheckedList(Array.from(checkedSet));
  };

  /**
   * 获取分类下选中
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const getTypeChildData = () => {
  //   setCurrentTabCheckedList(gatherMethods(currentTabKeys, checkedList, 1)); // 获取当前tab下的所有keys与选中项的交集
  // };

  useEffect(() => {
    setTimeout(() => {
      setAutoExpandParent(true);
      if (treeData && treeData.length && treeData[0].key) {
        setExpandedKeys([treeData[0].key]);
      }
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);


  // useEffect(() => {
  //   getTypeChildData();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [checkedList, currentTab]);

  // console.log(`currentTabCheckedList=  `, currentTabCheckedList);

  return (
    <Tree
      style={{
        height: '650px',
        overflowY: 'scroll',
      }}
      checkable
      blockNode
      expandedKeys={expandedKeys}
      onExpand={onExpand}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={currentTabCheckedList}
      treeData={treeData}
    />
  );
};

export default LabelLists;
