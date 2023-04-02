export interface QueryParamsType {
  page?: number;
  row?: number;
  os?: string;
}
interface DataType {
  _id: string;
  key?: string;
  desc?: string;
  end_time: number | moment.Moment;
  create_time?: number | moment.Moment;
  update_time?: number | moment.Moment;
  ios_time?: number | moment.Moment;
  pc_time?: number | moment.Moment;
  android_time?: number | moment.Moment;
  details: Item<DataType>[];
  version: string;
  time?: number | moment.Moment;
}
interface ResData {
  code: number;
  data: DataType[];
  msg: string;
}

interface BindVersionType {
  version: string;
  ids?: string;
  android_time?: number;
  ios_time?: number;
  pc_time?: number;
  end_time: number;
}
type Item<T> = {
  [K in keyof T]?: T[K];
};
