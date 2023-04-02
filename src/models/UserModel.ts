import {ServiceMsg} from "./BaseModel";

// 返回 详情
export interface UserMsg extends ServiceMsg<UserModel> {

}

export interface UserModel {
  eleList: UserMenuModel[];
  terrainList: UserTerrainModel[];
}

export interface UserMenuModel {
  eleId: string;
  eleName: string;
}

export interface UserTerrainModel {
  id: number;
  dataUrl: string;
  title: string;
}
