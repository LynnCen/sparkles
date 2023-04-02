import { PostJson } from '@/ts_pkc/ts-baselib';
import { ClassArray } from '@/ts_pkc/ts-json';
import userspace from '@/userspace';
import request from '@/utils/request';
import { QueryType } from './data';
import { FiveElement, MomentInfo, MomentTopic } from '../MomentManagement/service';
import { StatusResponse } from '@/services/type';

export class UserInfo {
  constructor(
     public data: {
      f_name: string,
      id: string,
      l_name: string,
      username: string
    } = {
      f_name: '',
      id: '',
      l_name: '',
      username: ''
    },
    public id: string

  ) {}
}
class MomentReportInfo {
  constructor(
    public id: string,
    public uid: string,
    public mid: string,
    public content: string,
    public create_time: number,
    public status: number
  ) {}
}
class Moments {
  constructor(
    public data: MomentInfo = new MomentInfo(
      '',
      '',
      '',
      '',
      '',
       0,
      0,
      0,
      0,
      '',
      '',
      0,
      0
    ),
   public id: string
  ) {}
}
class MomentReportList {
  constructor(
    public count: number,
    public err_code: number,
    public page: number,
    public items: MomentReportInfo[] = new ClassArray(MomentReportInfo),
    public moments: Moments[] = new ClassArray(Moments),
    public userinfo: UserInfo[] = new ClassArray(UserInfo)
  ) {}
}
export async function queryList(params?: QueryType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/reportmoments/lists',
      params || {page: 1, row: 10},
      MomentReportList,
      net
    )
  }

  return null
}



export async function updateStatus(id: string, status: number) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/reportmoments/update',
      {id, status},
      StatusResponse,
      net
    )
  }

  return null
  
}
