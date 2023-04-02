export interface ItemType {
  _id: string;
  url: string;
  image: Record<string, any>;
  link_id: string;
  status: number;
  sort: number;
  type: number;
  utime: number;
  itime: number;
}

export interface QueryType {
  page?: number;
  row?: number;
  name?: string;
  status?: string;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
}
