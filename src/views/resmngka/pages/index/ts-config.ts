// 资源类型枚举
export enum ResourceType {
  PLACE = 0, // 场地
  SPOT = 1, // 点位
}

/**
 * 资源管理信息
 */
export interface ResourceInfo {
  /**
   * ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;
}


export interface ResourceModalInfo {
  visible: boolean;
  toExportItems?: ResourceInfo[]
  exportHistory?: boolean
}

export interface ResourceModalProps {
  setResourceModalInfo: Function;
  setToExportItems: Function;
  onExport: Function;
  resourceModalInfo: ResourceModalInfo;
  onSearch: Function;
  resourceType: ResourceType;
  exportHistory?: boolean
}

export interface CategoryChooseModalInfo {
  visible: boolean;
  resourceType?: ResourceType;
  placeId?:number;
}

export interface CategoryChooseModalProps {
  categoryChooseModalInfo: CategoryChooseModalInfo;
  setCategoryChooseModalInfo: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}
