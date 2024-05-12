import { Permission } from '@/common/components/Operate/ts-config';
import { ReactNode } from 'react';
export interface DictionaryListData {
  data: DictionaryListItem[];
  permissions: Permission[];
}

// 字典分类列表数据
export interface DictionaryListItem {
  /**
   * 子集
   */
  children: Children[];
  /**
   * 编码
   */
  encode: string;
  /**
   * 分类ID
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
     * 父级类型
     */
  parent?: Parent;
  /**
   * 排序
   */
  sortNum: number;
  /**
   * 操作按钮
   */
  permissions: Permission[];
}

/**
 * 父级类型
 */
export interface Parent {
  children: Children[];
  encode: string;
  id: number;
  name: string;
  parent: Parent;
  sortNum: string;
}

export interface Children {
  children: Children;
  encode: string;
  id: number;
  name: string;
  parentId: number;
  sortNum: number;
}

export interface DrawerTableProps {
  visible: boolean;
  drawerClose: (val: boolean) => void;
  loadData: () => void;
  tablePermissions: Permission[];
}


export interface DictionaryData {
  dictionaryData: Array<DictionaryListItem>;
  children?: ReactNode;
}

// 新建/编辑字典分类弹窗数据
export interface InDrawerManageModal {
  visible: boolean;
  formData: InDrawerDictionaryFormDataType;
}

// 新建数据字典分类表单
export const inDrawerDictionaryFormData = {
  id: 0,
  name: '', // 名称
  encode: '', // 编码
  sortNum: 0, // 排序
  parentId: 0 // 父级ID
};

// 新建数据字典分类表单类型
export interface InDrawerDictionaryFormDataType {
  /**
   * 类型ID
   */
  id?: number;
  /**
   * 编码
   */
  encode: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 父级ID
   */
  parentId?: number | null;
  /**
   * 排序
   */
  sortNum?: number;
}

export interface MoadlFormProps {
  modalData: InDrawerManageModal;
  modalHandle: Function;
  loadData: () => void;
}

export interface SideBarProps {
  dictionaryId: number;
  loadData: () => void;
  onSelectTree: (id: number) => void;
  managePermissions: Permission[];
}

export interface DictionaryDataQuery {
  dictionaryId: number;
  keyword?: string;
}

export interface DictionaryDataListItem {
  /**
   * 编码
   */
  encode: string;
  /**
   * 数据ID
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  permissions: Permission[];
  /**
   * 排序
   */
  sortNum: number;
}

export interface DictionaryDataTableProps {
  listData: DictionaryDataListItem[];
  dictionaryId: number;
  mainBtnPermissions: Permission[];
  loadData: () => void;
}

export interface DictionaryModalData {
  visible: boolean;
  id: number;
  dictionaryId: number;
}


export interface DictionaryModalDataProps {
  modalData: DictionaryModalData;
  modalHandle: (val: boolean) => void;
  loadData: () => void;
}
