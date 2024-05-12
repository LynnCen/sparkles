// 分组类型
export enum GroupType {
  PROPERTY = 1, // 属性
  LABEL = 2, // 标签
}

// 属性类目还是属性
export enum PropertyType {
  CATEGORY = 1, // 类目
  PROPERTY = 2, // 属性
}

// 标签类目还是标签
export enum LabelType {
  CATEGORY = 1, // 类目
  LABEL = 2, // 标签
}

export interface PropertyTreeDrawInfo {
  visible: boolean;
  disabledOIds?: string[]; // 无法选中的oid集合
  categoryId?: number;
  categoryTemplateId?: number;
  categoryPropertyGroupId?: number;
}

export interface PropertyTreeDrawProps {
  setPropertyTreeDrawInfo: Function;
  propertyTreeDrawInfo: PropertyTreeDrawInfo;
  onSearch: Function;
}

export interface PropertyConfigModalInfo {
  visible: boolean;
  id?: number;
  categoryId?: number;
  categoryTemplateId?: number;
  propertyId?: number;
  controlType?: number;
  templateRestriction?: any;
  topSortNum?: number;
  formConfigList?: any[];
}

export interface PropertyConfigModalProps {
  setPropertyConfigModalInfo: Function;
  propertyConfigModalInfo: PropertyConfigModalInfo;
  onSearch?: Function;
}
/**
 * 子表单属性配置弹窗信息
 */
export interface SubFormPropertyConfigModalInfo {
  visible: boolean;
  categoryId?: number;
  categoryTemplateId?: number;
  propertyId?: number;
  controlType?: number;
  templateRestriction?: any;
  topSortNum?: number;
  required?: number;
  duplicate?: number;
  h5CustomerDisplay?: number;
}

/**
 * 子表单属性配置弹窗
 */
export interface SubFormPropertyConfigModalProps {
  setSubFormPropertyConfigModalInfo: Function;
  subFormPropertyConfigModalInfo: SubFormPropertyConfigModalInfo;
  onSuccessCb?: Function;
}

export interface GroupModalInfo {
  visible: boolean;
  categoryId?: number;
  categoryTemplateId?: number;
  groupType?: number;
  id?: number;
  name?: string;
}

export interface GroupModalProps {
  setGroupModalInfo: Function;
  groupModalInfo: GroupModalInfo;
  onSearch: Function;
}


export interface LabelTreeDrawInfo {
  visible: boolean;
  disabledOIds?: string[]; // 无法选中的oid集合
  categoryId?: number;
  categoryTemplateId?: number;
  categoryLabelGroupId?: number;
}

export interface LabelTreeDrawProps {
  setLabelTreeDrawInfo: Function;
  labelTreeDrawInfo: LabelTreeDrawInfo;
  onSearch: Function;
}
