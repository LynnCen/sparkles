import { TreeDataNode } from 'antd';

export interface HomeConfigProps {
  tenantId: string | number
}

export interface ColumnItem {
  code: string;
  name: string;
  sort: number;
  checked:number; // 0 | 1
}

export type ConfigItem = Omit<ColumnItem, 'configs'> & Record<'parent', number>
export type ColumnData = Array<ColumnItem>

// 生成随机的 ColumnData 数据
export function generateMockColumnData(count: number): ColumnData {
  const mockData: ColumnData = [];
  for (let i = 0; i < count; i++) {
    const columnItem: ColumnItem = {
      code: String(Math.floor(Math.random() * 1000)), // 生成一个 0 到 999 的随机数作为 code
      name: `Column ${i + 1}`, // 使用简单的字符串作为 name
      sort: i, // 生成一个 0 到 99 的随机数作为 sort
      checked: 0
    };
    mockData.push(columnItem);
  }
  return mockData;
}
// 重写TreeNode children
export interface TreeDataNodes extends TreeDataNode {
  children?: ColumnData & TreeDataNode['children']
}
// treeNode数据格式
export type TreeNodeData = ColumnItem & TreeDataNodes

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

export const checkAllSpaces = (input) => {
  // 使用正则表达式匹配是否全部为空格
  var regex = /^\s*$/;
  return regex.test(input);
};
