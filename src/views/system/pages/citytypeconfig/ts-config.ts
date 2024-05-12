import { v4 } from 'uuid';
export const defalutCityTypes = [
  { value: '新一线城市', name: v4(), disabled: true, delete: false },
  { value: '一线城市', name: v4(), disabled: true, delete: false },
  { value: '二线城市', name: v4(), disabled: true, delete: false },
  { value: '三线城市', name: v4(), disabled: true, delete: false },
  { value: '四线城市', name: v4(), disabled: true, delete: false },
  { value: '五线城市', name: v4(), disabled: true, delete: false },
  { value: '县城城市', name: v4(), disabled: true, delete: false },
  { value: '港澳台城市', name: v4(), disabled: true, delete: false },
];

// 城市类型数据
export interface CityTypes {
  id:number
  areaTypeName: string;
  edit: boolean;
  forbid: boolean;
}
