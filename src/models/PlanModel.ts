import { ServiceMsg } from "./BaseModel";

// 返回 详情
export interface PlanMsg extends ServiceMsg<PlanModel> {}

export interface PlanModel {
  createTime: string;
  id: number;
  description: string;
  title: string;
  userName: string;
  dataUrl: string;
  terrainVO: TerrainModel[] | null;
  map: MapModel;
  cameraLook: string;
  cameraPosition: string;
  balloon: number;
  area: number;
  line: number;
  push: number;
  build: number;
  isMap: boolean;
}

export interface TerrainModel {
  altitude: number;
  createTime: number;
  id: number;
  title: string;
  dataUrl: string;
}

export interface MapModel {
  mapType: number;
  inLineMapUrl: string;
  outLineMapUrl: string;
  inLineSwitch: number;
  outLineSwitch: number;
}

//
// // 返回 不带分页的列表
// export interface PlanDataListMsg extends ServiceDataListMsg<PlanDataList> {
//
// }
//
// export interface PlanDataList {
//   Camera_Look: string;
//   Camera_Position: string;
//   Color: string;
//   Height: string;
//   Id: number;
//   IsVisible: number;
//   Position: string;
//   Settings: { Height: string; }
//   Tag: string;
//   Title: string;
//   Type: string;
//   Url: string;
// }
