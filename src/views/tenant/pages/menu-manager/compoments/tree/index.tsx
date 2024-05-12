import { FC, Key, ReactNode, useEffect, useRef } from 'react';
import { Tree, Space } from 'antd';
import TreeNode from './TreeNode';
import './style/index.less';

// const { Search } = Input;

interface MenuTreeProps {
  data: TreeData[];
  selectedKey: Key;
  setSelectedkey: (key: Key) => void;
  onAction?: (key: Key, data: TreeData) => void;
  expandedKeys?: Key[];
  onClick?: (key: Key, data:any) => void;
  onSortByChildrenAndParentId?: (children: TreeData[], parentId: number, dragKey:Key) => void;
}

interface TreeData {
  title: string;
  key: Key;
  icon?: ReactNode;
  parentId?: Key | null;
  children?: TreeData[];
};

// 将树生成map保存当前key以及索引和所在的数组位置
export const gerenatorMap = (treeNode: any, map: Map<Key, any>) => {
  // if (!treeNode) {
  //   return map;
  // }
  if (!treeNode.children) {
    treeNode.children = []; // 防止后端返回的数据没有children或为null
  }
  const { children = [], parentId } = treeNode;
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
    gerenatorMap(children[i], map);
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
  const { data, onClick, selectedKey, setSelectedkey, onSortByChildrenAndParentId } = props;


  const treeMap = useRef<Map<Key, any>>(new Map());

  // const SerachButton = (
  //   <Button
  //     type='primary'
  //     icon={<SearchOutlined/>}>
  //     搜索
  //   </Button>
  // );

  const onDrop = info => {
    const { node, dropToGap, dragNode, } = info;
    console.log('dragNode', dragNode, node);
    // node         代表当前被drop 的对象
    // dragNode     代表当前drop 的对象
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
    if (!dropToGap) { // 一级菜单拖拽至二级
      console.log('111', 111);
      node.children = node.children || [];
      node.children.unshift(dragNode);
      onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(node.children) as any, node.value, dragKey);
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      console.log('222', 222);
      node.children = node.children || [];
      node.children.unshift(dragNode);
      onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(node.children) as any, node.value, dragKey);
    } else {
      if (dropPosition === -1) { // 拖动到顶部第一个
        console.log('333', 333);
        dropChildren.splice(dropIndex, 0, dragNode!);
        onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(dropChildren) as any, dropParentId, dragKey);
      } else { // 二级拖拽至一级/同级别拖拽
        console.log('444', 444, dropIndex, dropChildren);
        dropChildren.splice(dragIndex, 1);
        dropChildren.splice(dropIndex, 0, dragNode!);
        onSortByChildrenAndParentId?.(getKeyAndIndexByTreeNode(dropChildren) as any, dropParentId, dragKey);
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
      setSelectedkey(key);
      onClick?.(key, data);
    };
    // const handleActionChange = (key: Key) => {
    //   onAction?.(key, data);
    // };
    return (
      <div onClick={handleClick}>{
        selectedKey === key
          ? (<TreeNode title={title} icon={icon} />)
          : (<Space>{icon}{title}</Space>)}</div>
    );
  };


  useEffect(() => {
    if (data.length) {
      gerenatorMap({ key: null, children: data }, treeMap.current);
    }
  }, [data]);

  return (
    <div
      style={{
        marginBottom: 14,
      }}>
      {/* <Search
        style={{ marginBottom: 14 }}
        placeholder='请输入菜单名称'
        enterButton={SerachButton}
        // todo
        // onChange={onSerch}
        allowClear/> */}
      <div className='treeWrapper'>
        <Tree
          titleRender= {renderTitle}
          showIcon={false}
          style={{ paddingTop: 4 }}
          defaultExpandAll
          draggable
          selectedKeys={[selectedKey]}
          onDrop={onDrop}
          treeData={data}/>
      </div>
    </div>
  );
};

export default MenuTree;
