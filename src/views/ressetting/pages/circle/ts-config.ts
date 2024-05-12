import { FormInstance } from 'antd';

/**
 * 商圈信息
 */
export interface CircleInfo {
  /**
   * ID
   */
  id?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 省市区
   */
  cityId: number[];

  /**
   * 地址
   */
  address: string;

  /**
   * 级别
   */
  level: string;

  /**
   * 形状
   */
  shape: number;

  /**
   * 备注
   */
  explain: string;

  /**
   * 半径 & 坐标
   */
  circle:number;

  /**
   * 多边形坐标
   */
  polygon: any;
}

export interface CircleFormProps {
  setCircleFormInfo: Function;
  circleInfo: CircleInfo;
  onSearch: Function;
}

// 弹窗状态/新建/编辑/删除
export enum FormStatus {
  ADD = 'add', // 新建
  EDIT = 'edit', // 编辑
}

export interface CircleMapValue {
  longitude: number;
  latitude: number;
  radius: number;
}

export interface CircleMapProps {
  value?: CircleMapValue;
  onChange?: (value: CircleMapValue) => void;
  form: FormInstance;
  setCenterVal?: Function;
  display: string;
}

export interface PolygonMapValue {
  path: any;
}

export interface PolygonMapProps {
  value?: PolygonMapValue;
  onChange?: (value: PolygonMapValue) => void;
  display: string;
  setCenterVal?: Function
}
