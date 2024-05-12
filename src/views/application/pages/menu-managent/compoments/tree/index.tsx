import { FC, Key, ReactNode, useEffect, useRef, useState } from 'react';
import { Tree, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TreeNode from './TreeNode';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { treeFind } from '@lhb/func';

const { Search } = Input;

interface MenuTreeProps {
  data: TreeData[];
  onAction?: (key: Key, data: TreeData) => void;
  expandedKeys?: Key[];
  onClick?: (key: Key) => void;
  onSortByChildrenAndParentId?: (children: TreeData[], parentId: number) => void;
}

interface TreeData {
  title: string;
  key: Key;
  icon?: ReactNode;
  parentId?: Key | null;
  children?: TreeData[];
};

// 将树生成map保存当前key以及索引和所在的数组位置
export const generatorMap = (treeNode: any, map: Map<Key, any>) => {
  // if (!treeNode) {
  //   return map;
  // }
  const { children = [], key: parentId } = treeNode;
  for (let i = 0; i < children.length; i++) {
    const { key } = children[i];
    const newChildren = children.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children: subChilren, ...restItem } = item;
      return {
        ...restItem
      };
    });
    map.set(key, { children: newChildren, index: i, parentId });
    generatorMap(children[i], map);
  }
};



// 实现前端树进行搜索(暂时不实现)

// 获取📖节点中的key和index
export const getKeyAndIndexByTreeNode = (treeNodes: TreeData[]) => {
  return treeNodes.map((data, index) => {
    const { key } = data || {};
    return {
      id: key,
      index
    };
  });
};

const MenuTree: FC<MenuTreeProps> = (props) => {
  const { data, onAction, onClick, onSortByChildrenAndParentId } = props;

  const [selectedKey, setSelectedKey] = useState<Key>(0);
  const [treeData, setTreeData] = useState<any[]>([]);

  const treeMap = useRef<Map<Key, any>>(new Map());

  const SearchButton = (
    <Button
      type='primary'
      icon={<SearchOutlined/>}>
      搜索
    </Button>
  );

  useEffect(() => {
    setTreeData([...data]);
  }, [data]);

  const onDrop = info => {
    const { node, dropToGap, dragNode, } = info;

    // node         代表当前被drop 的对象
    // dragNode     代表当前需要drop 的对象
    // dropPosition 代表drop后的节点位置；不准确
    // dropToGap    代表移动到非最顶级组第一个位置

    // trueDropPosition: ( -1 | 0 | 1 ) dropPosition计算前的值，可以查看rc-tree源码;
    // -1 代表移动到最顶级组的第一个位置
    const dropKey = node.key;
    const dragKey = dragNode.key;
    const dropPos = node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const { children: dragChildren, index: dragIndex } = treeMap.current.get(dragKey);
    const { children: dropChildren, index: dropIndex, parentId: dropParentId } = treeMap.current.get(dropKey);
    dragChildren.splice(dragIndex, 1);
    // 在同层拖拽没有跨层
    // 拖到同层节点的最上面
    if (!dropToGap) {
      node.children = node.children || [];
      node.children.unshift(dragNode);
      onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(node.children) as any, node.key);
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
        (info.node as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
    ) {
      node.children = node.children || [];
      node.children.unshift(dragNode);
      onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(node.children) as any, node.key);
    } else {
      if (dropPosition === -1) {
        dropChildren.splice(dropIndex, 0, dragNode!);
        onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(dropChildren) as any, dropParentId);
      } else {
        dropChildren.splice(dragIndex, 1);
        dropChildren.splice(dropIndex + 1, 0, dragNode!);
        onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(dropChildren) as any, dropParentId);
      }
    }
  };


  const renderTitle = (nodeData: TreeData) => {
    const { title, icon, key, ...restNodeData } = nodeData;
    const data = {
      ...restNodeData,
      title,
      key,
    };
    const handleClick = () => {
      setSelectedKey(key);
      onClick?.(key);
    };
    const handleActionChange = (key: Key) => {
      onAction?.(key, data);
    };
    return (
      <div onClick={handleClick}>{
        selectedKey === key
          ? (<TreeNode title={title} icon={icon} onClick={handleActionChange}/>)
          : (<Space>{icon}{title}</Space>)}</div>
    );
  };


  useEffect(() => {
    generatorMap({ key: null, children: data }, treeMap.current);
  }, [data]);


  const methods = useMethods({
    onSearch(keyword) {
      if (!keyword) {
        setTreeData([...data]);
        return;
      }
      const filterData = data.filter((item) => {
        if (item.title?.indexOf(keyword) > -1) return true;
        if (!item.children?.length) return false;
        return treeFind(item.children, (child) => child.title?.indexOf(keyword) > -1);
      });
      setTreeData([...filterData]);
    },
  });

  return (
    <div
      style={{
        marginBottom: 14,
      }}>
      <Search
        style={{ marginBottom: 14 }}
        placeholder='请输入菜单名称'
        enterButton={SearchButton}
        onSearch={methods.onSearch}
        allowClear/>
      <div className={styles.treeWrapper}>
        <Tree
          titleRender= {renderTitle}
          showIcon={false}
          style={{ paddingTop: 4 }}
          defaultExpandAll
          draggable
          onDrop={onDrop}
          treeData={treeData}/>
      </div>
    </div>
  );
};

export default MenuTree;
