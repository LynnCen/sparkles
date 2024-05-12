import { get, post } from '@/common/request';
import { menus } from '../api';

export interface MenuData {
  parentId?: string	 // 父菜单
  appId: string	 // appid
  name:	string	// 菜单名称
  encode:	string	// 编码
  icon?: string	// 图标
  uri?: string	// 跳转url
  sortNum?: string //
}

interface Menu {
  getMenusByAppId<T>(appId: number): Promise<T>;
  deleteMenuNByAppId(id: number): Promise<null>;
  reorderMenuByDragIdAndDropId(menus: any[], parentId: number): Promise<null>;
};

class MenuStore implements Menu {
  getMenusByAppId<T>(appId: number): Promise<T> {
    return get(menus.get('menus') as string, { appId }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }

  deleteMenuNByAppId(id: number): Promise<null> {
    return post(menus.get('delete'), { id }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }

  reorderMenuByDragIdAndDropId(menu: any[], parentId: number): Promise<null> {
    return post(menus.get('reorder'), { items: menu, parentId }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }
}

export default new MenuStore();
