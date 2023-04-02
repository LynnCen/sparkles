// import request from '@/utils/request';
import { PostJsonLogin, PostJsonLogout } from '@/ts_pkc/ts-baselib';
import userspace from '@/userspace';
import type { UserSpace, Net } from '@/utils/ts/ts-baselib-master';
import md5 from 'js-md5';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function accountLogin(
  params: LoginParamsType, 
  us: UserSpace, 
  netName?: string
) {
  const req = {
    uri: '/login',
    content: {
      username: params.userName,
      password: md5(params.password)
    },
  }
  
  return PostJsonLogin(req, us, netName)
}

export async function accountLogout() {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJsonLogout('/loginOut', net)
  }

  return null
}
