export interface ItemType {
  _id: string;
  lang: string;
  word: string;
  status: number;
  itime: number;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  status?: number;
  lang?: string;
  sorttime?: string;
}

export interface EditType {
  id?: string;
  lang?: string;
  word?: string;
  status?: number;
}
