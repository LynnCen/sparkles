export interface ItemType {
  id: string;
  lang: string;
  version: string;
  type: number;
  ios_audit: number;
  android_audit: number;
  status: number;
  create_time: number;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  version?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
}
