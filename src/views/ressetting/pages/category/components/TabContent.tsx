import { getCategoryRes } from '@/common/api/category';
import SearchTree from '@/common/business/SearchTree';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
// import { EllipsisOutlined } from '@ant-design/icons';
import { recursionEach } from '@lhb/func';
import { Dropdown, message, Tag } from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { CategoryModalInfo, ResourceType } from '../ts-config';
import CategoryModal from './Modal/CategoryModal';

// 将树生成map保存当前key以及索引和所在的数组位置
export const gerenatorMap = (treeNode: any, map: Map<Key, any>) => {
  // if (!treeNode) {
  //   return map;
  // }
  const { childList = [], id: parentId } = treeNode;
  for (let i = 0; i < childList.length; i++) {
    const { id } = childList[i];
    const newChildren = childList.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { childList: subChilren, ...restItem } = item;
      return {
        ...restItem
      };
    });
    map.set(id, { childList: newChildren, index: i, parentId });
    gerenatorMap(childList[i], map);
  }
};

// 获取📖节点中的key和index
export const getKeyAndIndexByTreeNode = (treeNodes: any[]) => {
  return treeNodes.map((data, index) => {
    const { id } = data || {};
    return {
      id,
      index
    };
  });
};

const TabContent: FC<{ resourceType: ResourceType }> = ({ resourceType }) => {
  const [selectedItem, setSelectedItem] = useState<any>();
  const [treeData, setTreeData] = useState<Array<any>>([]);
  const treeMap = useRef<Map<Key, any>>(new Map());
  const [categoryModalInfo, setCategoryModalInfo] = useState<CategoryModalInfo>({ visible: false, resourceType });
  const { onAddBtnClick, loadData, addOperation, addOperations, refactorTitle, onNewSubCategory, onEdit, onDelete } =
    useMethods({
      loadData: async () => {
        const result = await getCategoryRes({ resourcesType: resourceType });
        recursionEach(result, 'childList', (item: any) => {
          item.keyword = item.name;
          // item.name = methods.refactorTitle(item);
        });
        const resultWithOptions = addOperations(result, 0);
        setTreeData(resultWithOptions);
      },
      refactorTitle(item) {
        return item.resourcesType === 0 ? (
          <div style={{ display: 'flex' }}>
            <div style={{ width: 120, }}>
              {item.name}
              {item.categoryType === 0 ? (
                <Tag key={item.id} color='green' style={{ marginLeft: '10px' }}>
                标类
                </Tag>
              ) : (
                <Tag key={item.id} color='orange' style={{ marginLeft: '10px' }}>
                非标类
                </Tag>
              )}
            </div>
            {addOperation(item)}
          </div>
        ) : (
          <>
            {item.name}
            {addOperation(item)}
          </>
        );
      },
      addOperations(data, level) {
        if (!data) {
          return [];
        }
        return data.map((item) => {
          item.level = level;
          const children = item.childList;
          const obj = {
            // icon: () => {
            //   return addOperation(item);
            // },
            ...item,
          };
          obj.childList = children ? addOperations(children, level + 1) : undefined;
          return obj;
        });
      },
      addOperation(item) {
        const menu = [
          { key: '1', label: '新增子分类', onClick: () => onNewSubCategory(item) },
          { key: '2', label: '编辑', onClick: () => onEdit(item) },
          { key: '3', label: '删除', onClick: () => onDelete() },
        ];
        return (
          <span style={{ float: 'right' }}>
            <Dropdown menu={{
              items: menu,
            }} placement='bottomRight' arrow trigger={['hover']}>
              <div style={{ width: '200px', textAlign: 'right' }}>...</div>
            </Dropdown>
          </span>
        );
      },
      onNewSubCategory(item) {
        if (item.level >= 3) {
          message.warn('只能创建4级目录');
          return;
        }
        setCategoryModalInfo({ parentId: item.id, visible: true, resourceType, categoryType: item.categoryType });
      },
      onEdit(item) {
        setCategoryModalInfo({
          id: item.id,
          resourceType: item.resourcesType,
          visible: true,
          categoryType: item.categoryType,
          name: item.keyword,
          childList: item.childList,
          parentId: item.parentId,
          identification: item.identification

        });
        // menu.domEvent.stopPropagation();
      },
      onDelete(menu) {
        ConfirmModal({
          onSure: (modal) => {
            post('/category/delete', { id: selectedItem.id }, true).then(() => {
              modal.destroy();
              loadData();
            });
          },
        });
        menu.domEvent.stopPropagation();
      },
      onAddBtnClick() {
        setCategoryModalInfo({ visible: true, resourceType });
      },
    });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [resourceType]);

  const onSortTree = async (parentId: string, items: any) => {
    await post('/category/reorder', { parentId, items }, true);
    loadData();
  };

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
    const { childList: dragChildren, index: dragIndex, parentId: dragParentId = null } = treeMap.current.get(dragKey);
    const { childList: dropChildren, index: dropIndex, parentId: dropParentId = null } = treeMap.current.get(dropKey);
    dragChildren.splice(dragIndex, 1);
    // 在同层拖拽没有跨层
    // 拖到同层节点的最上面并且只能是根结点
    if (!dropToGap && !node.level) {
      node.childList = node.childList || [];
      node.childList.unshift(dragNode);
      onSortTree(dropKey, getKeyAndIndexByTreeNode(node.childList));
      return;
    }

    // 限制同层拖拽
    if (dragParentId !== dropParentId) {
      return;
    }

    if (
      ((info.node as any).props.childList || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      node.childList = node.childList || [];
      node.childList.unshift(dragNode);
      onSortTree(node.key, getKeyAndIndexByTreeNode(node.children));
    }


    if (dropPosition === -1) {
      dropChildren.splice(dropIndex, 0, dragNode!);
      onSortTree(dropParentId, getKeyAndIndexByTreeNode(dropChildren));
      return;
    }

    dropChildren.splice(dragIndex, 1);
    dropChildren.splice(dropIndex + 1, 0, dragNode!);
    onSortTree(dragParentId, getKeyAndIndexByTreeNode(dropChildren));

  };

  const draggable = (nodeData: any) => {
    const { level } = nodeData;
    if (!level) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    gerenatorMap({ key: null, childList: treeData }, treeMap.current);
  }, [treeData]);

  return (
    <>
      <SearchTree
        data={treeData}
        onSelect={(_, { node }) => {
          setSelectedItem(node);
        }}
        checkable={false}
        switcherIcon={null}
        titleRender= {refactorTitle}
        draggable={draggable}
        onDrop={onDrop}
        fieldNames={{ title: 'name', key: 'id', children: 'childList' }}
      >
        <Operate operateList={[{ name: '新增类目', event: 'onOk', type: 'primary', onClick: onAddBtnClick }]} />
      </SearchTree>
      <CategoryModal
        categoryModalInfo={categoryModalInfo}
        setCategoryModalInfo={setCategoryModalInfo}
        onSearch={loadData}
      />
    </>
  );
};

export default TabContent;
