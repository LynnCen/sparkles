import { get } from '@/common/request';
import { Permission } from '@/views/application/pages/menu-managent/store/button';
import { pointMap } from '../api';
import { Group } from './site';



interface Respone {
  resourceGroupList?: Group[];
  permissions?: Permission
}

interface Point {
  getInfoById(id: number, module: string, isKA?: boolean): Promise<Respone>
}

class PointStore implements Point {
  getInfoById(id: number, module, isKA?: boolean): Promise<Respone> {
    return get(pointMap.get('detail'), { id, module, isKA }, true);
  }
}

export default new PointStore();
