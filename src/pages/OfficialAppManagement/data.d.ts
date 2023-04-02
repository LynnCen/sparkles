export interface ItemType {
  _id: string;
  name: string;
  mch_id: string;
  mch_name: string;
  status: number;
  itime: number;
}

export interface ItemInfoType {
  _id: string;
  name: string;
  mch_id: string;
  mch_name: string;
  avatar: string;
  is_reply: number;
  is_global: number;
  status: number;
  remark: string;
  itime: number;
}

export interface QueryType {
  page?: number;
  row?: number;
  name?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemInfoType> {
  id?: string;
}
