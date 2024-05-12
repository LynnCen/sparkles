/* eslint-disable react-hooks/exhaustive-deps */
/* 左侧树 */
import { FC, useState, useEffect } from 'react';
import { Tree } from 'antd';
// import { getKeys } from '@/common/utils/ways';
import styles from '../entry.module.less';

const LeftTree: FC<any> = ({
  treeData,
  onSelect,
}) => {
  const fieldNames = { title: 'name', key: 'encode', children: 'children' };
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  // 递归查找最小层级
  // const selectChild = (arr) => {
  //   if (arr.children && arr.children.length > 0) {
  //     return selectChild(arr.children[0]);
  //   } else {
  //     return arr.encode;
  //   }
  // };
  const selectChild = (arr, index) => {
    if (arr.children && arr.children.length > 0) {
      return selectChild(arr.children[0], ++index);
    } else {
      return { code: arr.encode, index };
    }
  };
  useEffect(() => {
    disabledFatherItem(treeData, 1);
    if (!selectedKeys.length && treeData && treeData.length) {
      for (let i = 0; i < treeData.length; i++) {
        const data = selectChild(treeData[i], 1);
        if (data.index === 3) {
          setSelectedKeys([data.code]);
        }
      }
    }
  }, [treeData]);

  // selectedKeys改变同步到外部
  useEffect(() => {
    onSelect && onSelect(selectedKeys);
  }, [selectedKeys]);

  // 选中节点
  const onSelectKey = (selectedKeys: any, info: any) => {
    const selectIds = [info.node.encode];
    setSelectedKeys(selectIds);
  };
  // 让拥有children的元素禁用
  const disabledFatherItem = (data: any, index) => {
    data.map((item) => {
      if (item.children.length || index < 3) {
        item.disabled = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        disabledFatherItem(item.children, ++index);
      }
    });
  };
  return (
    <div className={styles.treeWrap}>
      <div className={styles.title}>组织架构</div>
      {treeData.length > 0 && <Tree
        defaultExpandAll
        selectedKeys={selectedKeys}
        treeData={treeData}
        onSelect={onSelectKey}
        fieldNames={fieldNames}
      />}
    </div>
  );
};

export default LeftTree;
