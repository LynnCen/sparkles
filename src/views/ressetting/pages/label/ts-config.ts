/**
 * 标签类目信息
 */
export interface LabelClassificationInfo {
  /**
   * 类目ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 父级类目ID
   */
  parentId?: number;
}

export interface LabelClassificationModalInfo extends LabelClassificationInfo {
  visible: boolean;
}

export interface LabelClassificationModalProps {
  setLabelClassificationModalInfo: Function;
  labelClassificationModalInfo: LabelClassificationModalInfo;
  onSearch: Function;
}

// 弹窗状态/新建/编辑/删除
export enum ModalStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}

/** ************** 属性 ******************/

/**
 * 标签信息
 */
export interface LabelInfo {
  /**
   * 标签ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   *  标签分类ID
   */
  labelClassificationId?: number;
}

export interface LabelModalInfo extends LabelInfo {
  visible: boolean;
}

export interface LabelModalProps {
  setLabelModalInfo: Function;
  labelModalInfo: LabelModalInfo;
  onSearch: Function;
}
