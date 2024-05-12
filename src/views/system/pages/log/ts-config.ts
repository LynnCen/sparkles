
export interface AppMenuResult {
  /**
   * 菜单列表
   */
  moduleList?: ModuleList[];
}


export interface ModuleList {
  /**
   * 子菜单
   */
  children: ModuleList[];
  /**
   * 编码
   */
  encode: string;
  /**
   * icon
   */
  icon: string;
  /**
   * 菜单ID
   */
  id: number;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 父菜单ID
   */
  parent: any;
  /**
   * 排序码
   */
  sortNum: string;
  /**
   * 跳转uri
   */
  uri: string;
}
