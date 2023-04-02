import { StatusResponse } from '@/services/type';
import { PostJson } from '@/ts_pkc/ts-baselib';
import { ClassArray } from '@/ts_pkc/ts-json';
import userspace from '@/userspace';
import request from '@/utils/request';
import { QueryParamsType } from './data';
import { UserInfo } from '../Report/service';


export class FiveElement {
  constructor(
    public bucketId: string,
    public format: string,
    public height: number,
    public width: number,
    public mediaType: number,
    public objectId: string,
    public size: number,
    public posterFormat: string,
    public posterObjectId: string,
    public duration: number
  ) {}
}
export class MomentTopic {
  constructor(
    public id: string,
    public name: string
  ) {}
}
export class MomentInfo {
  constructor(
    public id: string,
    public uid: string,
    public username: string,
    public text: string,
    public is_hours24: string,
    public type: number,
    public content_type: number,
    public auth_type: number,
    public status: number,
    public refer_root: string,
    public refer_pre: string,
    public create_time: number,
    public update_time: number,
    public refer_pres: string[] = new ClassArray(''),
    public topics: MomentTopic[] = new ClassArray(MomentTopic),
    public media: FiveElement[] = new ClassArray(FiveElement),

  ) {}
}
class MomentList {
  constructor(
    public count: number,
    public err_code: string,
    public page: number,
    public items: MomentInfo[] = new ClassArray(MomentInfo),
    public userinfo: UserInfo[] = new ClassArray(UserInfo)
  ) {}
}
export async function queryList(params?: QueryParamsType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/moments/lists',
      {...params},
      MomentList,
      net
    )
  }
  
  return null
}



export async function momentInfo(id: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/moments/detail',
      {id},
      MomentInfo,
      net
    )
  }
  
  return null
}


export async function deleteMoments(id: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/moments/delete',
      {id},
      StatusResponse,
      net
    )
  }
  
  return null
}


export async function updateStatus(params: {id: string, status: number}) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/moments/forbidden',
      {...params},
      StatusResponse,
      net
    )
  }
  
  return null
}