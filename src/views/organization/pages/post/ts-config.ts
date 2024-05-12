// 新增/编辑岗位
export interface PostModalValuesProps extends ListRecordProps {
  visible: boolean;
}

export interface PostModalProps {
  setOperatePost: Function;
  operatePost: PostModalValuesProps;
  onSearch: Function;
}

// 岗位管理表格
export interface PostTableProps {
  setOperatePost: Function;
  loadData: Function;
  params: any;
  onSearch: Function;
}

export interface PostProps {
  tenantId?: string | number;
}

// 筛选需要的/默认
export interface FilterProps {
  onSearch?: Function; // 筛选项改变-点击查询/重置按钮
}

export interface RoleListResult {
  meta: Meta;
  objectList?: ListRecordProps[];
  pageNum?: number;
  pageSize?: number;
  totalNum?: number;
}

export interface Meta {
  permissions: MetaPermission[];
}

export interface MetaPermission {
  event?: string;
  name?: string;
}

export interface ListRecordProps {
  /**
   * 备注
   */
  desc?: null;
  /**
   * 编码
   */
  encode?: string;
  /**
   * 创建时间
   */
  gmtCreate?: string;
  /**
   * 修改时间
   */
  gmtModified?: string;
  /**
   * ID
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;
  permissions?: ObjectListPermission[];
}

export interface ObjectListPermission {
  event: string;
  name: string;
}
