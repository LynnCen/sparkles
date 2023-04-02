import type { QueryParamsType, EditType, ItemType, AccessItem} from './data';
import { PostJson } from '@/ts_pkc/ts-baselib';
import { StatusResponse } from '@/services/type';
import userspace from '@/userspace';
import { Access, Permission } from '@/services/user-type';
import { ClassArray } from '@/ts_pkc/ts-json';


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
class MenuListRes {
  constructor(
    public err_code: number,
    public items: Access[] = new ClassArray(MenuListItem)
  ) {}
}
export async function getAuthMenu() {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/menu',
      {},
      MenuListRes,
      net
    )
  }
  
  return null
}



class RoleListItem {
  constructor(
    public id: string,
    public name: string,
    public status: number,
    public create_time: number
  ) {}
}
class RoleListRes {
  constructor(
    public err_code: number,
    public count: number,
    public page: number,
    public items: ItemType[] = new ClassArray(RoleListItem)
  ) {}
}
export async function queryList(params?: QueryParamsType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/role/lists',
      params || { page: 1, row: 10 },
      RoleListRes,
      net
    )
  }

  return null;
}


// class RoleAccessItem {
//   constructor(
//     public label: string,
//     public value: number,
//     public is_select: 0 | 1
//   ) {}
// }
class RoleInfoRes {
  constructor(
    public id: string,
    public name: string,
    public create_time: number,
    public access: Access[] = new ClassArray(MenuListItem),
  ) {}
}
export async function getInfoById(id: string) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/role/detail',
      { id },
      RoleInfoRes,
      net
    )
  }
  
  return null
}

// export async function getAuthMenu() {
//   return request('/role/menu', {
//     method: 'GET',
//   });
// }


export async function updateById(params: EditType) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/role/update',
      {
        ...params
      },
      StatusResponse,
      net
    )
  }
  
  return null
}

export async function addNew(params: EditType) {
  const net = userspace.current?.nf.get('main')

  if (net)  {
    return PostJson(
      '/role/add',
      {
        ...params
      },
      StatusResponse,
      net
    )
  }
  
  return null
}

// export async function deleteById(params: { id: string }) {
//   return request('/role', {
//     method: 'POST',
//     data: {
//       ...params,
//     },
//   });
// }

export async function setStatusById(params: { id: string; status: number }) {
  const net = userspace.current?.nf.get('main')

  if (net) {
    return PostJson(
      '/role/forbidden',
      params,
      StatusResponse,
      net
    )
  }

  return null
}
