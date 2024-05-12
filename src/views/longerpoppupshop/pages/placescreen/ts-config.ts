export interface MockDemo {
  a: Function;
}
/* 拓店任务 */
export type Task = {
  id: string;
  name: string;
};
export type FilterParmas = {
  keyword: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  /* 工作日客流 */
  flowWeekdaySelectId: number;
  /* 节假日客流 */
  flowWeekendSelectId: Number;
};

export type PlaceList = {
  id: number;
  /* 表单类型 */
  code: string;
  chancePointName: string;
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  districtId: number;
  districtName: string;
  /* 场地名称 */
  placeName: string;
  /* 等级 */
  kaLevelId: number;
  kaLevelName: string;
  /* 场地类型 */
  placeCategoryName: string;
  /* 工作日客流 */
  flowWeekdaySelectId: number;
  flowWeekdaySelectName: string;
  /* 节假日客流 */
  flowWeekendSelectId: number;
  flowWeekendSelectName: string;
  /* 点位名称 */
  spotName: string;
  spotLength: number;
  spotWidth: number;
  spotSquare: number;
  /* 点位租金 */
  rentMonth: number;
  /* 点位视频 */
  spotVideo: string[];
  /* 点位图片 */
  spotPicture: string[];
  /* 按钮权限 */
  permissionButtonVOS: {
    event: string;
    name: string;
  };
};

export type PlaceListMeta = {
  data: any;
  currentPage: number;
  from: number;
  to: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type PlaceListResponse = {
  data: PlaceList[];
  meta: PlaceListMeta;
};
