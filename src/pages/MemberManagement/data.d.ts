export interface ItemType {
  id: string;
  username: string;
  role_name: string;
  role_id:string;
  remark: string;
  create_time: number,
  status: number
}

export interface QueryType {
  page?: number;
  row?: number;
  sorttime?: string;
}

export interface EditType {
  id?: string;
  role_id?: string;
  username?: string;
  remark?: string
}

export interface AddNewType extends Partial<ItemType> {
  username: string;
  role_id: string;
  password: string;
  re_password: string;
  remark?: string;
}

export interface InfoItemType extends ItemType {
  update_time: string
}

export interface OrgItemType {
  _id: string;
  name: string;
  remark: string;
}
