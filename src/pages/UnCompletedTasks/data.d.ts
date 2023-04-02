export interface ItemType {
  _id: string;
  desc: string;
  level: number;
  status: number;
  start_time: number | moment.Moment;
  end_time: number | moment.Moment;
  create_time: number | moment.Moment;
  update_time: number | moment.Moment;
  os: [];
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  level?: number;
  os?: string;
  status?: number;
}

export interface AddNewType {
  username?: string;
  email?: string;
  name?: string;
  f_name?: string;
  l_name?: string;
  status?: number;
  password?: string;
}

export interface EditType extends AddNewType {
  id?: string;
}
