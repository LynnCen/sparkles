/**
 * 属性类目信息
 */
export interface PropertyClassificationInfo {
  /**
   * 类目ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;
}


export interface PropertyClassificationModalInfo extends PropertyClassificationInfo {
  visible: boolean;
}

export interface PropertyClassificationModalProps {
  setPropertyClassificationModalInfo: Function;
  propertyClassificationModalInfo: PropertyClassificationModalInfo;
  onSearch: Function;
}


// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}

// 类目还是属性
export enum PropertyType {
  CATEGORY = 1, // 类目
  PROPERTY = 2, // 属性
}

/** ************** 属性 ******************/

/**
 * 属性信息
 */
export interface PropertyInfo {
  /**
   * 属性ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 属性分类ID
   */
  propertyClassificationId?:number;

  /**
   * 控件类型
   */
  controlType?: number;

  /**
   * 约束条件
   */
  restriction?: string;
}


export interface PropertyDrawInfo extends PropertyInfo{
  visible: boolean;
}

export interface PropertyDrawProps {
  setPropertyDrawInfo: Function;
  propertyDrawInfo: PropertyDrawInfo;
  onSearch: Function;
}

/**
 * @description 文件上传控件可选的文件类型
 * 因为需要复用，从src/views/ressetting/pages/property/components/Config/UploadConfig.tsx迁移出来，原作者是夏奇
 */
export const uploadTypeOptions = [
  { label: '.png', value: '.png' },
  { label: '.jpg', value: '.jpg' },
  { label: '.jpeg', value: '.jpeg' },
  { label: '.bmp', value: '.bmp' },
  { label: '.heic', value: '.heic' },
  { label: '.gif', value: '.gif' },
  { label: '.ppt', value: '.ppt' },
  { label: '.pptx', value: '.pptx' },
  { label: '.pdf', value: '.pdf' },
  { label: '.rm', value: '.rm' },
  { label: '.rmvb', value: '.rmvb' },
  { label: '.mpeg-1', value: '.mpeg-1' },
  { label: '.mpeg-2', value: '.mpeg-2' },
  { label: '.mpeg-3', value: '.mpeg-3' },
  { label: '.mpeg-4', value: '.mpeg-4' },
  { label: '.mov', value: '.mov' },
  { label: '.mtv', value: '.mtv' },
  { label: '.dat', value: '.dat' },
  { label: '.wmv', value: '.wmv' },
  { label: '.avi', value: '.avi' },
  { label: '.3gp', value: '.3gp' },
  { label: '.amv', value: '.amv' },
  { label: '.dmv', value: '.dmv' },
  { label: '.flv', value: '.flv' },
  { label: '.mp4', value: '.mp4' },
  { label: '.dwg', value: '.dwg' },
];
