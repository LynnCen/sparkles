export interface ItemType {
  itime: number;
  name: string;
  status: number;
  _id: number;
}

export interface ItemParamsType {
  name?: string;
  page?: number;
  row?: number;
  sorttime?: string;
  id?: number;
}
