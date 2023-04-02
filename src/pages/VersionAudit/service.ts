import request from '@/utils/request';
import { QueryParamsType, EditType } from './data';
import userspace from '@/userspace';
import { PostJson } from '@/ts_pkc/ts-baselib'
import { StatusResponse } from '@/services/type';
import { ClassArray } from '@/ts_pkc/ts-json';


class VersionAuditItem {
  constructor(
    public id: string,
    public lang: string,
    public status: number,
    public type: number,
    public ios_audit: number,
    public android_audit: number,
    public version: string,
    public create_time: number,

  ) {}
}
class VersionAuditRes {
  constructor(
    public count: number,
    public page: number,
    public err_code: number,
    public items: VersionAuditItem[] = new ClassArray(VersionAuditItem)
  ) {}
}
export async function queryList(params?: QueryParamsType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/lists',
      params || {page: 1, row: 10},
      VersionAuditRes,
      net
    )
  }

  return null
}



export async function queryVersionById(id?: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/detail',
      {id},
      VersionAuditItem,
      net
    )
  }

  return null
}


export async function updateById(params: EditType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/update',
      params,
      StatusResponse,
      net
    )
  }

  return null
}


export async function addNew(params: EditType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/add',
      params,
      StatusResponse,
      net
    )
  }

  return null
}

export async function deleteById(params: { id: string }) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/delete',
      params,
      StatusResponse,
      net
    )
  }

  return null
}

export async function setStatusById(params: { id: string; status: number }) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/audit/forbidden',
      params,
      StatusResponse,
      net
    )
  }

  return null
}
