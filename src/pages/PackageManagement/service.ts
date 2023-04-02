import userspace from '@/userspace';
import { PostJson } from '@/ts_pkc/ts-baselib';
import type { QueryType, UpdateParams, YmlInfo } from './data';
import { StatusResponse } from '@/services/type';
import { ClassArray } from '@/ts_pkc/ts-json';

class PkgItem {
  constructor(
    public id: string,
    public desc: string,
    public version: string,
    public apk: Apk =new Apk('', '', '', 0, ''),
    public type: number,
    // public yml: YmlInfo,
    public create_time: number
  ) {}
}
class PkgListRes {
  constructor(
    public count: number,
    public err_code: number,
    public page: number,
    public items: PkgItem[] = new ClassArray(PkgItem),
  ) {}
}
export async function queryList(params?: QueryType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/apk/lists',
      params || {page: 1, row: 10},
      PkgListRes,
      net
    )
  }

  return null
}



class Apk {
  constructor(
    public objectId: string,
    public name: string,
    public fileType: string,
    public size: number,
    public bucketId: string,
  ) {}
}
class YmlInfoFile {
  constructor(
    public url: string,
    public sha512: string,
    public size: number
  ) {}
}
class YmlInfoRes {
  constructor(
    public version: string,
    public path: string,
    public sha512: string,
    public releaseDate: string,
    public files: YmlInfoFile = new YmlInfoFile('', '', 0)
  ) {}
}
class PkgInfoRes {
  constructor(
    public id: string,
    public type: number,
    public apk: Apk =  new Apk('', '', '', 0, ''),
    public yml: YmlInfo = new YmlInfoRes('', '' ,'' ,''),
    public version: string,
    public desc: string,
    public create_time: number,
  ) {}
}
export async function queryInfoById(id: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/apk/detail',
      {id},
      PkgInfoRes,
      net
    )
  }

  return null
}



export async function updateById(params: UpdateParams & {id:string}) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/apk/update',
      params,
      StatusResponse,
      net
    )
  }

  return null
}

export async function addNew(params: Omit<UpdateParams, 'id'>) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/apk/add',
      {...params},
      StatusResponse,
      net
    )
  }
  
  return null
}
