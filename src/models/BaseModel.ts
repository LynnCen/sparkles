export interface ServiceMsg<T> {
  code: number; //200
  data: T;
  message: string //SUCCESS
}

export interface ServicePageList<T> {
  count: number;
  list: Array<T>
}


export interface ServiceDataListMsg<T> {
  code: number;
  data: Array<T>;
  message: string;
}

export interface IGetList {
  page: number;
  size: number;
  key: string;
}
