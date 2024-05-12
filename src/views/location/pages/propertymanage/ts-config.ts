export interface CategoryModalProps {
  setOperateCategory: Function;
  operateCategory: CategoryModalValuesProps;
  onSearch: Function;
}

// 新增/编辑属性分类
export interface CategoryModalValuesProps {
  id?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 标识
   */
  code?: string;
  visible: boolean;
}

export interface PropertyModalProps {
  setOperateProperty: Function;
  operateProperty: PropertyModalValuesProps;
  onSearch: Function;
}

// 新增/编辑属性
export interface PropertyModalValuesProps {
  id?: number;

  /**
   * 名称
   */
  name?: string;
  /**
   * 标识
   */
  code?: string;

  /**
   * 属性类目id
   */
  categoryId?: number;

  /**
   * 属性别名
   */
  aliaName?: string;

  /**
   * 属性图标
   */
  icon?: string;

  visible: boolean;
}
