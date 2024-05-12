/**
 * @Description 本组件为一级商圈选择，已停用。
 * 已改用二级商圈选择组件 src/common/components/business/ClusterTypeTree/index.tsx
 */
import { Tree } from 'antd';
import { FC, useEffect } from 'react';
import { TreeNode } from './LeftCon';
const BusinessTree:FC<any> = ({
  businessTreeData,
  setBusinessTreeData,
  setBusinessTypeList
}) => {
  // 点击Switch
  const clickSwitch = (node, checked) => {
    // 由于目前树结构只存在两层，所以不需要多层次递归遍历
    const res = businessTreeData.map((item) => {
      let allFlagTrue = true;// 当点击过子节点后，判断同级子节点是否全已选中
      // 点击父节点
      if (item.key === node.key) {
        // 设置本身的checked
        item.checked = checked;
        // 如果存在子元素，则设置子元素的checked
        item?.children?.map((child) => {
          child.checked = checked;
        });
        return item;
      }
      // 点击子节点
      item?.children?.map((child) => {
        if (child.key === node.key) {
          child.checked = checked;
        }
        if (!child.checked) {
          allFlagTrue = false;
        }
      });
      // 当子节点没有都已选中时，父节点设为不选中
      item.checked = allFlagTrue;

      return item;
    });
    setBusinessTreeData(res);
  };
  useEffect(() => {
    const res:any = [];
    businessTreeData[0]?.children?.map((item) => {
      if (item?.checked) {
        res.push(item?.key);// 接口这里要求传title，字符串类型
      }
    });

    // 如果全选则不传
    setBusinessTypeList(businessTreeData[0]?.checked ? null : res);
  }, [businessTreeData]);


  return <div>
    {businessTreeData[0]?.children.length ? <Tree
      treeData={businessTreeData}
      selectable={false}
      blockNode// 节点占据一行
      defaultExpandAll// 默认全展开
      style={{
        marginTop: 16,
        marginLeft: 12
      }}
      titleRender={(node:any) => {
        return <TreeNode node={node} clickSwitch={clickSwitch}/>;
      }}
    /> : <></>}
  </div>;
};
export default BusinessTree;
