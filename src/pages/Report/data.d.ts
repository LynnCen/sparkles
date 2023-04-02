import { FiveElement } from "../MomentManagement/service";

export interface ItemType {
  key: string,
  uid: string,
  username: string,
  uid_by: string,
  username_by: string,
  content: string,
  create_time: number,
  status: number,
  media: FiveElement[],
  content_type: number
  auth_type: number,
  text: string,
}

export interface QueryType {
  page?: number;
  row?: number;
  uid?: string;
  username?: string;
  phone?: string;
  content?: string
}
