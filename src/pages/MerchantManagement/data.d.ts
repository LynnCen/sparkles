export interface ItemType {
  _id: string;
  username: string;
  email: string;
  name: string;
  f_name: string;
  l_name: string;
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
