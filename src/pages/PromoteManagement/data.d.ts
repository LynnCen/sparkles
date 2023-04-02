export interface ItemType {
  _id: string;
  name: string;
  mch_id: string;
  mch_name: string;
  secret: string;
  link_url: string;
  status: number;
  itime: number;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  status?: string;
  name?: string;
  sorttime?: string;
}

export interface EditType {
  id?: string;
  name?: string;
  mch_id?: string;
  link_url?: string;
}
