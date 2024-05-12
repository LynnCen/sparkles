/**
 * 类目信息
 */
export interface CategoryInfo {
  /**
   * 类目ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 标准类型
   */
  categoryType?: number;

  /**
   * 类目类型
   */
  resourceType: number;

  /**
   * 父级类目ID
   */
  parentId?: number;

  childList?: any;

  /**
   * 点位标识
   */
  identification?: any
}

export interface CategoryModalInfo extends CategoryInfo {
  visible: boolean;
}

export interface CategoryModalProps {
  setCategoryModalInfo: Function;
  categoryModalInfo: CategoryModalInfo;
  onSearch: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}

// 资源类型枚举
export enum ResourceType {
  PLACE = 0, // 场地
  SPOT = 1, // 点位
}

// 标准类型枚举
export enum StandardType {
  STANDARD = 1, // 标准
  NOT_STANDARD = 2, // 非标准
}
