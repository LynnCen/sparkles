export interface MockDemo {
  a: Function;
}

export type FilterParmas = {
  keyword: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  /* 状态 */
  reportCycle: number;
  /* 工作日客流 */
  flowWeekdaySelectId: number;
  /* 节假日客流 */
  flowWeekendSelectId: Number;
};

export type Reports = {
  id: string;
  /* 备选址名称 */
  reportName: string;
  /* 状态 */
  reportCycle: number;
  reportCycleName: string;
  // chancePointName: string;
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
  /* 点位视频 */
  spotVideo: string[];
  /* 点位图片 */
  spotPicture: string[];
  /* 按钮权限 */
  permissions: {
    event: string;
    name: string;
  };
  /* 模板编码 */
  code: string;
  /* 模板映射id */
  dynamicRelationId: number;
  /* 租金 */
  contractRent: number;
};

export type ObjectList = {
  /* 拓店任务id */
  id: number;
  /* 拓店任务名称 */
  name: string;
  reports: Reports[];
};

export type PlaceManageResponse = {
  objectList: ObjectList[];
  currentPage: number;
  total: number;
  size: number;
  lastPage: number;
};
