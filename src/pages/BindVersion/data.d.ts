export interface QueryParamsType {
  page?: number;
  row?: number;
  level?: number;
  os?: string;
  status?: number;
}
interface DataType {
  _id: string;
  key?: string;
  desc: string;
  level: number;
  status: number;
  start_time: number | moment.Moment;
  end_time: number | moment.Moment;
  create_time: number | moment.Moment;
  update_time: number | moment.Moment;
  os: [];
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
