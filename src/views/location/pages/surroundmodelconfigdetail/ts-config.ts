export interface PropertyTreeDrawInfo {
  visible: boolean;
  disabledOIds?: string[]; // 无法选中的oid集合
  modelId?: number;
}

export interface PropertyTreeDrawProps {
  setPropertyTreeDrawInfo: Function;
  propertyTreeDrawInfo: PropertyTreeDrawInfo;
  onSearch: Function;
}
