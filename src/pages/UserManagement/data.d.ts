enum SexCategory {
  Unknown,
  Male,
  Female,
}

export interface ItemType {
  id: string;
  f_name: string;
  phone_prefix: string;
  gender: number;
  name: string;
  l_name: string;
  tmm_id: string;
  phone: string;
  create_time: number;
  status: number;
}

export interface InfoItemType {
  _id: string;
  avatar: string;
  background: string;
  birthday: string;
  gender: SexCategory;
  isset_tmm_id: number;
  itime: number;
  name: string;
  phone: string;
  phone_prefix: string;
  qr_code: string;
  region: string;
  region_id: string;
  status: number;
  tmm_id: string;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  phone?: string;
  username?: string;
  tmm_id?: string
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
