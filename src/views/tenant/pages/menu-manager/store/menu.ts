import { post } from '@/common/request';
import { menus } from '../api';


export interface MenuData {
  id?: number
  moduleId?: number// 功能模块id
  moduleParentId?: number; // 父级功能模块ID
  moduleName?: number; // 模块名称
  appId: string	 // appid
  name:	string	// 菜单名称
  tntInstId?: string	// 租户id
  sortNum?: string // 排序
}

interface Menu {
  deleteMenuNByAppId(id: number): Promise<null>;
};

class MenuStore implements Menu {

  deleteMenuNByAppId(id: number): Promise<null> {
    return post(menus.get('delete'), { id }, {
      proxyApi: '/mirage',
      needHint: true
    });
  }

}

export default new MenuStore();
