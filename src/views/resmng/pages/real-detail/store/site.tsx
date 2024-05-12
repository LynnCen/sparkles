import { get } from '@/common/request';
import { Permission } from '@/views/application/pages/menu-managent/store/button';
import { siteMap } from '../api';

export interface Group {
  groupId?: number;
  groupName?:	string;
  propertyList?: Property[]
}

export interface Property {
  controlType?:	number;
  propertyName?:	string;
  value?: string;
  columns?: { title: string, dataIndex: string }[]
}

interface Respone {
  resourceGroupList?: Group[];
  permissions?: Permission
}

interface Site {
  getInfoById(id: number, module: string, isKA?: boolean): Promise<Respone>
}

class SiteStore implements Site {
  getInfoById(id: number, module: string, isKA: boolean): Promise<Respone> {
    return get(siteMap.get('detail'), { id, module, isKA }, true);
  }
}

export default new SiteStore();
