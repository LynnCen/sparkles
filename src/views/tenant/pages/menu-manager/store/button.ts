import { post, get } from '@/common/request';
import { buttons } from '../api';
import { MenuData } from './menu';


export interface Permission {
  id: number;
  name: string;
  encode: string
}

interface Modules extends MenuData {
  permissions: Permission[]
}

interface Button {
  getListByMenuId(appId: number): Promise<Permission[]>;
};


class ButtonStore implements Button {
  async getListByMenuId(menuId: number): Promise<Permission[]> {
    const result = await get(buttons.get('list') as string, { moduleId: menuId }, {
      proxyApi: '/mirage',
      needHint: true
    });
    const { permissions } = result || {};
    return permissions || [];
    // return result;

  };

  deleteItemById(id: number): Promise<Modules> {
    return post(buttons.get('delete') as string, { id }, {
      proxyApi: '/mirage',
      needHint: true
    });
  };

}

export default new ButtonStore();
