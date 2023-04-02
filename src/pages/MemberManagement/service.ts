import request from '@/utils/request';
import type { QueryType, EditType, AddNewType, InfoItemType, ItemType } from './data';
import userspace from '@/userspace';
import { PostJson } from '@/ts_pkc/ts-baselib';
import { StatusResponse } from '@/services/type';
import { ClassArray } from '@/ts_pkc/ts-json';

class StaffListItem {
  constructor(
    public id: string,
    public username: string,
    public role_name: string,
    public role_id:string,
    public remark: string,
    public create_time: number,
    public status: number
  ) {}
}
class StaffListRes {
  constructor(
    public count: number,
    public page: number,
    public err_code: number,
    public items: ItemType[] = new ClassArray(StaffListItem),
  ) {}
}
export async function queryList(params?: QueryType) {
  const net = userspace.current?.nf.get('main')

  if (net) {  
    return PostJson(
      '/staff/lists',
      params || { page: 1, row: 10 },
      StaffListRes,
      net
    )
  }

  return null
}

class StaffInfoRes {
  constructor( 
    public id: string,
    public username: string,
    public role_id: string,
    public role_name: string,
    public remark: string,
    public create_time: number,
    public update_time: number,
  ) {}
}
export async function getInfoById(id: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/staff/detail',
      {id},
      StaffInfoRes,
      net
    )
  }
  
  return null
}


export async function updateById(params: EditType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/staff/update',
      params,
      StatusResponse,
      net
    )
  }
  
  return null
}


export async function addNew(params: Partial<AddNewType>) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/staff/add',
      params,
      StatusResponse,
      net
    )
  }

  return null
}


export async function updatePassword(params: {
  id?: string;
  password?: string;
  re_password?: string;
}) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/staff/updatePassword',
      params,
      StatusResponse,
      net
    )
  }

  return null
}

export async function deleteById(params: { id: string }) {
  return request('/staff', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/staff/forbidden',
      params,
      StatusResponse,
      net
    )
  }

  return null
}
