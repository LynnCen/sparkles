import { PostJson } from '@/ts_pkc/ts-baselib';
import { ClassArray } from '@/ts_pkc/ts-json';
import userspace from '@/userspace';
import { Access, LoginInfoRes, Permission } from './user-type';

class PermObj {
  constructor(
    public label: string,
    public value: number
  ) {}
}
class MenuListItem {
  children: Access[] = []
  constructor(
    public id: string,
    public key: string,
    public p_key: string,
    public name: string,
    public permission: Permission[] = new ClassArray(PermObj),
  ) {
    this.children = new ClassArray(this)
  }
}
class UserInfoRes {
  constructor(
    public id: string,
    public role_id: string,
    public username: string,
    public remark: string,
    public status: number,
    public access: Access[] = new ClassArray(MenuListItem),
    public is_admin: boolean
  ) {}
}
export async function queryCurrent() {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/loginDetail',
      {},
      UserInfoRes,
      net
    )
  }

  return null
}
