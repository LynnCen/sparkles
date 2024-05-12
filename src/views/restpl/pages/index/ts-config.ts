/**
 * 模板信息
 */
export interface TemplateInfo {
  /**
   * 模板ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 描述
   */
  desc?: string;
  /**
   * 创建时间
   */
  gmtCreate?: string;
}

export interface TemplateModalInfo extends TemplateInfo {
  visible: boolean;
}

export interface TemplateModalProps {
  setTemplateModalInfo: Function;
  templateModalInfo: TemplateModalInfo;
  onSearch: Function;
}

export interface ChooseCategoryModalInfo {
  visible: boolean;
  resourceType?: number;
  categoryTemplateId?: number;
  name?:string
  resourceTypeName?:string
  useType?:number;
}

export interface ChooseCategoryModalProps {
  setChooseCategoryModalInfo: Function;
  chooseCategoryModalInfo: ChooseCategoryModalInfo;
}
export interface ChooseCategoryExportModalProps {
  setChooseCategoryExportModal: Function;
  modalData: ChooseCategoryModalInfo;
}

export interface CopyCategoryModalInfo {
  visible: boolean;
  resourceType?: number;
  categoryTemplateId?: number;
  name?:string
}

export interface CopyCategoryModalProps {
  setCopyCategoryModalInfo: Function;
  copyCategoryModalInfo: CopyCategoryModalInfo;
  onSearch: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}
