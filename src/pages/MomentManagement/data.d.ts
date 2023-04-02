import { FiveElement } from "./service";

export interface ItemType {
  key: string;
  uid: string;
  username: string;
  auth_type: number;
  text: string;
  media: FiveElement[],
  create_time: number,
  content_type: number,
  status: number,
  id: string,
  // agree_num: number;
  // body: string;
  // type: string;
  // collect_num: number;
  // comment_num: number;
  // read_num: number;
  // trans_num: number;
  // resource: ResourceType[];
  // remind_friends: any[];
  // location: any[];
  // itime: number;
}

export interface ResourceType {
  height: number;
  width: number;
  url: string;
}

export interface QueryParamsType {
  page?: number;
  row?: number;
  uid?: string;
  username?: string;
  phone?: string;
  content?: string;
  status?: number;

}
