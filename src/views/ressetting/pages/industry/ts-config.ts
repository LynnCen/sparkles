/**
 * 行业信息
 */
export interface IndustryInfo {
  /**
   * ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 父级行业ID
   */
  parentId?: number;
}

export interface IndustryModalProps {
  industryModalInfo: IndustryInfo;
  setIndustryModalInfo:Function
  onSearch: Function;
  modalVisible: boolean;
  setModalVisible: Function;
  treeData?: any;
}

export interface IndustryTableProps {
  industryTableInfo: IndustryInfo;
  onSearch: Function;
  tableDisplay: string;
  setTableDisplay: Function;
  setModalVisible: Function;
  setIndustryModalInfo: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}
