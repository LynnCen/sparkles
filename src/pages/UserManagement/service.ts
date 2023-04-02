import { PostJson } from '@/ts_pkc/ts-baselib';
import { ClassArray } from '@/ts_pkc/ts-json';
import userspace from '@/userspace';
import request from '@/utils/request';
import md5 from 'js-md5';
import { StatusResponse } from '@/services/type';
import type { QueryParamsType, EditType, AddNewType, InfoItemType } from './data';


class UserInfo {
  constructor(
    public id: string,
    public phone_prefix: string,
    public phone: string,
    public tmm_id: string,
    public gender: number,
    public name: string,
    public f_name: string,
    public l_name: string,
    public status: number,
    public create_time: number
  ) {}
}

class UserListRes {
  constructor(
    public count: number,
    public items: UserInfo[] = new ClassArray(UserInfo),
    public page: number
  ) {}
}

export async function queryList(params?: QueryParamsType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/user/lists',
      params || {page: 1, row: 10},
      UserListRes,
      net
    )
  }

  return null
}


interface updateParams {
  id: string,
  reason: string,
  status: number
}
export async function updateStatus(params: updateParams) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/user/forbidden',
      params,
      StatusResponse,
      net
    )

  }

  return null
}










export async function queryInfoById(id: string): Promise<InfoItemType> {
  return request('/user/index', {
    params: { id },
    method: 'GET',
  });
}

export async function updateById(params: EditType) {
  return request('/user/index', {
    method: 'POST',
    data: {
      ...params,
      password: params.password && md5(params.password),
    },
  });
}

export async function addNew(params: Partial<AddNewType>) {
  return request('/staff', {
    method: 'POST',
    data: {
      ...params,
      password: params.password && md5(params.password),
    },
  });
}

export async function deleteById(params: { id: string }) {
  return request('/nearby_property', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function setStatusById(params: { id: string; status: number }) {
  return request('/user/index/forbidden', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryRoleOrg() {
  return request('/role/org', { method: 'GET' });
}
