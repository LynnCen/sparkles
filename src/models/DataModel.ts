import { ServicePageList } from "./BaseModel";

/**
 * @param width 线宽
 * @param height 抬升高度
 * @param depthTest 是否穿透
 * @param lineColor 线颜色
 * @param lineStyle 线的样式
 */
export interface LineModel {
  width?: number;
  altitude?: number;
  depthTest?: boolean;
  color?: string;
  lineStyle?: string;
  vertices?: any;
  isClose?: boolean;
  id?: number;
  level?: boolean;
}

export interface BlockModel {
  color?: string;
  vertices?: any;
  height?: number;
  altitude?: number;
  title?: string;
  level?: boolean;
  id?: number;
  opacity?: number;
}

export interface PushModel {
  vertices?: any;
  height?: number;
  title?: string;
}

/**
 * @description 标签属性修改
 */
export interface UpdateBalloon {
  id: number;
  cameraPosition: number[];
  cameraLook: number[];
  title: string;
  color: string;
  balloonVisible: boolean;
  pointVisible: boolean;
  altitude: number;
  fontSize: number;
  fontFamily?: string;
  fontItalic?: boolean;
  imageUrl: string;
  contentId?: number[];
  subMenuId?: number;
  whethshare: boolean;
  bottom?: number;
  iconType: string;
}

// 返回 标签列表
export interface BalloonPageList extends ServicePageList<BalloonModel> {}

export interface BalloonModel {
  cameraLook: string;
  cameraPosition: string;
  color: string;
  content: string;
  height: string;
  id: number;
  visible: number;
  planId: number;
  position: string;
  settings: string;
  tag: string;
  title: string;
  type: string;
  url: string;
  userId: number;
}

export interface SetConfigModel {
  id: number;
  copyright: string;
  defaultPlan: string;
  defaultMenu: string;
  defaultTerrain: string;
  logoUrl: string;
  logoTitle: string;
  pageTitle: string;
  pageIcon: string;
  isReg: number;
  isMobile: number;
  isFailToLock: number;
  lockingType: string;
  loginFailCount: number;
  lockingHours: number;
  mapList: MapModel[];
}

export interface MapModel {
  mapType: number;
  inLineMapUrl: string;
  outLineMapUrl: string;
  inLineSwitch: number;
  outLineSwitch: number;
}
