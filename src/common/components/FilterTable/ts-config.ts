import { ReactNode } from 'react';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import { TableProps } from 'antd/lib/index';

type RecordType = any;
interface defaultSorterProps {
  order: string;
  orderBy: string;
}

export interface FetchData {
  dataSource: Array<Record<string, any>>;
  count?: number;
}

type PaginationProps = boolean & TablePaginationConfig;

export interface FilteredTableProps extends TableProps<RecordType> {
  initialFilters?: any;
  onFetch: (params?: object) => Promise<FetchData>;
  className?: string;
  filters?: object;
  rowKey: string;
  pagination?: PaginationProps; // 是否显示分页-默认显示
  defaultSorter?: defaultSorterProps; // 首次进入默认排序入参
  childrenColumnName?: string; // 指定树形结构的列名
  defaultExpendAll?: boolean; // 树结构表格默认是否展开，默认为true
  paginationLeft?: ReactNode | (() => ReactNode);
  refreshCurrent?: boolean; // 当前页面刷新
  emptyContent?: ReactNode | string; // 自定义空数据展示
  paginationIsDisabled?: Boolean; // 是否禁用分页
  clickPagination?: () => void // 分页区域（整体）点击事件
}
