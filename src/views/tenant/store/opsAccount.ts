import { get, post } from '@/common/request';
import opsAccountMap from '../pages/api/opsAccount';

//  运维账号接口相关定义
interface OpsAccount {
  id:	number;	// id
  accountId?:	number;	// 账号id:（移除账号接口使用此id）
  accountName?:	string;	// 账号名称
  mobile?:string;	// 手机号
  department?:string;	// 部门
  gmtCreate?:	string;	// 创建时间
  permissions?: Permission[]
};

export interface Permission {
  event?:	string;
  name?:string;
};

export interface List {
  permissions?: Permission[]
  objectList?: OpsAccount[];
};

// 用户列表接口定义
export interface User {
  id?: number;	// ID
  name?: string;	// 姓名
  mobile?: string;	// 手机号
};


interface Account {
  getList(tenantId: number): Promise<List>;
  add(tenantId: number, employeeId: number): Promise<boolean>;
  remove(tenantId: number, employeeId: number): Promise<boolean>;
  getUserListBykeyword(keyword: string) : Promise<{label?: string, value?: number}[]>;
};

class AccountStore implements Account {
  async getList(tenantId: number): Promise<List> {
    const result = await get(opsAccountMap.get('list'), { tenantId }, {
      proxyApi: '/mirage',
      needHint: true
    }) || {};
    const { objectList, meta } = result;
    if (!meta) {
      return {
        objectList,
        permissions: []
      };
    }

    const { permissions } = meta;

    return {
      objectList,
      permissions
    };
  }

  add(tenantId: number, employeeId: number): Promise<boolean> {
    return post(opsAccountMap.get('add'), { tenantId, employeeId }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }

  remove(tenantId: number, accountId: number): Promise<boolean> {
    return post(opsAccountMap.get('remove'), { tenantId, accountId }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }

  async getUserListBykeyword(keyword: string): Promise<{label?: string, value?: number}[]> {
    const objectList = await post(opsAccountMap.get('search'), { keyword }, {
      proxyApi: '/mirage',
      needHint: true
    }) || {};
    if (!objectList) {
      return [];
    }

    return objectList.map(object => {
      const { id, name, mobile } = object;
      return {
        value: id,
        label: `${name}(${mobile})`
      };
    });
  }
};

export default new AccountStore();
