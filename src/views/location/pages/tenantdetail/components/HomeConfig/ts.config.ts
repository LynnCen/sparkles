import { TreeDataNode } from 'antd';
import React from 'react';
export interface HomeConfigProps {
  tenantId: string | number
}

export enum MapKey {
  'DataBrief' = 'DataBrief', // 数据简报
  'DataReports' = 'DataReports', // 数据报表
  'StoreStatus' = 'StoreStatus', // 门店状态
  'StoreMap' = 'StoreMap', // 门店地图
  'ConversionFunnels' = 'ConversionFunnels' // 转换漏斗

}
enum TreeMapKey {
  'DataBrief' = 1, // 与接口id映射
  'ConversionFunnels',
  'StoreMap',
  'DataReports',
  'StoreStatus',
}

// 接口数据格式
export interface HomeDetail {
  tenantId: number;
  tenantHomeConfig: Array<TenantHomeConfig>
}

export interface TenantHomeConfig {
  id: number;
  isShow: 0 | 1;
  name: string;
  index: number;
  configs: Array<ConfigItem>;
  [k: string]: any
}

export type ConfigItem = Omit<TenantHomeConfig, 'configs'> & Record<'parent', number>

// 重写TreeNode children
export interface TreeDataNodes extends TreeDataNode {
  children: Array<TenantHomeConfig> & TreeDataNode['children']
}
// treeNode数据格式
export type TreeNodeData = TenantHomeConfig & TreeDataNodes

// 根据key，递归找到指定节点，通过回调函数对data数据进行修改
export function loopNode<T extends TreeDataNode>(data: T[], key: React.Key, callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].key === key) {
      return callback(data[i], i, data);
    }
    if (data[i].children) {
      loopNode(data[i].children!, key, callback);
    }
  }
}

// 将接口数据TenantHomeConfig[]处理为treenode形式的TreeNodeData[]
export const transformToTreeData = (data: Array<TenantHomeConfig>): Array<TreeNodeData> => {
  const loopNode = (arr: Array<TenantHomeConfig | ConfigItem>, key: string, first: boolean) => {
    // 根据index排序
    const sortArr = arr.sort((a, b) => (a.index - b.index));
    return sortArr.map((item, index) => {
      const newItem = { ...item };
      // 通过KEY来建立父子的映射关系
      const KEY = first ? `${TreeMapKey[item.id]}` : `${key}-${index}`;
      newItem.key = KEY;
      newItem.title = item.name;
      // 门店地图和门店分布展示checked
      const filterId = item.id === TreeMapKey.StoreMap || item.id === TreeMapKey.StoreStatus;
      if (!filterId && item.configs) {
        newItem.disableCheckbox = true;
        newItem.checkable = false;
        newItem.selectable = false;
        // 递归处理子节点
        newItem.children = loopNode(item.configs, KEY, false);
      }
      return newItem as TreeNodeData;
    });
  };
  return loopNode(data, '', true);

};
// 将treeNode数据处理为接口数据 TreeNodeData[]->TenantHomeConfig[]
export const transformToConfig = (data: Array<TreeNodeData>, selectKey: React.Key[]) => {
  const loopNode = (node: Array<TreeNodeData>, kes: React.Key[], isFirst: boolean) => {
    return node.map((item, index) => {
      let isShow = 0;
      // first代表遍历父级第一层
      if (isFirst) {
        // 如果一个父级的子元素被选中、则将父级的isShow设为1
        const showParent = kes.find((it) => (it as string).startsWith(item.key as string));
        isShow = showParent ? 1 : 0;
      } else {
        isShow = Number(kes.includes(item.key));
      }
      const newItem = {
        id: item.id,
        name: item.title ?? item.name,
        isShow: isShow,
        index: index
      };
      if (item.children || item.configs) {
        Reflect.set(newItem, 'configs', loopNode(item.children as Array<TreeNodeData> || item.configs, kes, false));
      }
      if (item.parentId) {
        Reflect.set(newItem, 'parentId', item.parentId);
      }
      return newItem;
    });

  };
  return loopNode(data, selectKey, true);

};

export const disCheckboxFromData = (data: Array<TreeNodeData>, selectKey: React.Key[], Key: MapKey, flag: boolean) => {
  return data.map((item) => {
    const newItem = { ...item };
    if (item.key === Key) {
      newItem.children = newItem.children.map((item) => {
        if (!selectKey.includes(item.key)) {
          item.disableCheckbox = flag;
        }
        return item;
      }) as any;
    }
    return newItem;
  });

};

export function insertElementBetween<T, K>(arr: T[], element: K): Array<T | K> {
  const result: Array<T | K> = [];
  for (let i = 0; i < arr.length - 1; i++) {
    result.push(arr[i]);
    result.push(element);
  }
  result.push(arr[arr.length - 1]); // 添加最后一个元素
  return result;
}

// 判断是否处于同一层级
export const isSameLevel = (a, b) => {
  const aLevel = a.props.pos.split('-').length;
  const bLevel = b.props.pos.split('-').length;

  return aLevel === bLevel;
};
// 判断是否具有相同的父亲节点
export const isSameParent = (a, b) => {
  const aLevel = a.props.pos.split('-');
  const bLevel = b.props.pos.split('-');
  aLevel.pop();
  bLevel.pop();
  return aLevel.join('') === bLevel.join('');
};
// 判断拖拽元素的落点是否在第一个
export const isDropToFirst = (a, b) => {
  const aLevel = a.props.pos.split('-');
  const bLevel = b.props.pos.split('-');
  aLevel.pop();
  return aLevel.join('') === bLevel.join('');
};
// 根据key来设置相邻样式
export const getKeysAdjacentStyles = (gData, index, KEY, isShow) => {
  // 判断key是否在相邻前一个位置
  const isFront = index > 0 && gData[index - 1].key === KEY;
  // 判断key是否在相邻后一个位置
  const isAround = index < (gData.length - 1) && gData[index + 1].key === KEY;
  const isAdjacent = isFront || isAround;
  const styles = {
    display: 'inline-block',
    width: '49%',
    minWidth: '600px'
  };
  if (isAdjacent && isShow) {
    styles[isAround ? 'marginRight' : 'marginLeft'] = '0.6%';
  }
  return styles;
};
export const checkAllSpaces = (input) => {
  // 使用正则表达式匹配是否全部为空格
  var regex = /^\s*$/;
  return regex.test(input);
};


// 地图级别
export enum mapLevel {
  country = 1,
  province
}

