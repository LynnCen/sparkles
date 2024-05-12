import { TablePaginationConfig } from 'antd/lib/table/interface';
import { TableProps } from 'antd/lib/index';
import { CSSProperties, ReactNode } from 'react';

interface defaultSorterProps {
  order: string;
  orderBy: string;
}

export interface FetchData {
  dataSource: Array<Record<string, any>>;
  count?: number;
}

/**
 * FC是一个泛型，对不同的组件属性采用特定的类型。
 * 请注意，children属性在Props中不需要定义。其实，它已经在FC类型中定义了。
 * 如果需要显式的传递children，可以用children?: React.ReactNode
 */

type PaginationProps = TablePaginationConfig & boolean;

export interface FilteredTableProps extends TableProps<any> {
  paginationConfig?: object;
  initialFilters?: any;
  onFetch: (params?: object) => Promise<FetchData>;
  className?: string;
  filters?: object;
  rowKey: string;
  pagination?: PaginationProps; // 是否显示分页-默认显示
  pageSize?: number; // 可传入控制初始分页量
  paginationSlot?: any; // 分页行左侧插槽
  defaultSorter?: defaultSorterProps; // 首次进入默认排序入参
  childrenColumnName?: string; // 指定树形结构的列名
  defaultExpendAll?: boolean; // 树结构表格默认是否展开，默认为true
  wrapClassName?: string;
  wrapStyle?: CSSProperties;
  emptyContent?: ReactNode | string; // 自定义空数据展示
}
