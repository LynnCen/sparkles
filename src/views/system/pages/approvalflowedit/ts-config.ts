/**
 * @description 部门树
 */
export interface DepartmentTreeItem{
  /**
   * @description 名称
   */
  name: string;
  /**
   * @description 部门id
   */
  id: number;
  /**
   * @description 编码
   */
  encode: string;
  /**
   * @description 创建时间
   */
  gmtCreate: string;
  /**
   * @description 修改时间
   */
  gmtModified: string;
  /**
   * @description 子部门列表
   */
  children?:DepartmentTreeItem[];
}
