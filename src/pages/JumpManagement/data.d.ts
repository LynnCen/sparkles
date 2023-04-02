export interface ItemType {
  _id: string;
  name: string;
  sub_type: number;
  type: number;
  url: string;
  status: number;
  itime: number;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  status?: number;
  name?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
  utime?: number;
}
