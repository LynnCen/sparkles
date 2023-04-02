export interface ItemType {
  _id: string;
  resource: any[] | string;
  body: string;
  u_id: string;
  start_time: number | Moment;
  end_time: number | Moment;
  num: number;
  status: number;
}

export interface QueryType {
  page?: number;
  row?: number;
  sorttime?: string;
}

export interface EditType extends Partial<ItemType> {
  id?: string;
}
