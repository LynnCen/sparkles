import request from '@/utils/request';
import type { ItemParamsType } from './data';
import { PostJson } from '@/ts_pkc/ts-baselib';
import userspace from '@/userspace';
import { ClassArray } from '@/ts_pkc/ts-json';
import { StatusResponse } from '@/services/type';


export class VersionLog {
  constructor(
    public title: string,
    public log: string[] = [],
  ) {}
}
class VersionItem {
  constructor(
    public id: string,
    public lang: string,
    public status: number,
    public type: number,
    public version: string,
    public download_url: string,
    public logs: VersionLog[] = new ClassArray(VersionLog),
    public is_forced: number,
    public create_time: number,
  ) {}
}
class VersionListRes {
  constructor(
    public count: number,
    public page: number,
    public err_code: number,
    public items: VersionItem[] = new ClassArray(VersionItem)
  ) {}

}
export async function queryList(params?: ItemParamsType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/version/lists',
      params || { page: 1, row :10 },
      VersionListRes,
      net
    )
  } 
 
  return null
}




export async function queryVersionById(id?: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/version/detail',
      { id },
      VersionItem,
      net
    )
  }

  return null
}


export async function updateById(params: {
  download_url?: string,
  is_forced?: number
  id?: string;
  logs: VersionLog[],
  lang?: string;
  version?: number;
  type?: number;
  status?: number;
}) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/version/update',
      {...params},
      StatusResponse,
      net  
    )
  }

  return null
}

export async function addNew(params: {
  download_url?: string,
  is_forced?: number
  id?: string;
  logs: VersionLog[],
  lang?: string;
  version?: number;
  type?: number;
  status?: number;
}) {
  const net = userspace.current?.nf.get('main')
  
  if (net) {
    return PostJson(
      '/version/add',
      {...params},
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
      '/version/delete',
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
      '/version/forbidden',
      params,
      StatusResponse,
      net  
    )
  }

  return null
}
