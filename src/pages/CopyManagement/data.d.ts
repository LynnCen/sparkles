export interface ItemType {
  _id: string;
  lang: string;
  key: string;
  value: string;
  need_trans: number;
  status: number;
  itime: number;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  key?: string;
  lang?: string;
  sorttime?: string;
}

export interface EditType {
  id?: string;
  lang?: string;
  key?: string;
  value?: string;
  need_trans?: number;
}
