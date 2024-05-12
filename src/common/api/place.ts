import { get, post } from '@/common/request/index';

export interface SearchParams extends City {
  placeName?: string;
  placeCategoryIdList?: number[];
  placeLabelIdList?: number[];
  constructionTimeRange?: Range;
  placeAreaRange?: Range;
  spotCountRange?: Range
  supplyCountRange?: Range
}

export interface City {
  provinceIdList?: number[];
  cityIdList?: number[];
  districtIdList?: number[];
}

export interface Range {
  maxValue?: number,
  minValue?: number
}

export interface File {
  name?: string;
  type?: string;
  url?: string;
}

export interface Label {
  tenantPlaceId?: number,
  tenantLabelId?: number,
  labelName?: string,
  reviewStatus: 1 | 2|3
}

export interface PlaceInfo {
  tenantPlaceId?: number,
  placeName?: string,
  address?: string,
  categoryId?: number,
  categoryName?: string,
  area?: number;
  constructionTime?: number,
  spotCounr?: number,
  supplierCount?: number;
  buildingLevel?: string
  builtArea?: number,
  businessCircle?: string
  workdayDayAvg?: number;
  placeDescription?: string;
  placeLabelList?: Label[];
  panorama?: File[];
  placePicture?: File[];
  placeVideo?: File[];
  floorPlan?: File[];
}

interface Response {
  totalNum?: number;
  pageNum?: number;
  pageSize?: number;
  objectList?: PlaceInfo[]
}

export interface CreateInfo {
  placeName: string,
  placeCategoryId: number,
  area: {
    provinceId: number,
    cityId: number,
    districtId: number
  },
  address: {
    address: string,
    longitude: number,
    latitude: number,
    poiId: number,
    poiName: number
  }
}

export function postPlaceList(params?: any) {
  return post('/place/page', { ...params }, { isMock: false, needHint: true });
}

export function kaPlaceList(params?: any) {
  return post('/place/pageKA', { ...params }, { isMock: false, needHint: true });
}

export function similarPlaceList(params?: any) {
  return get('/place/similar', { ...params }, { isMock: false, needHint: true });
}

/**
 * KA场地列表 标签选项初始化接口
 * https://yapi.lanhanba.com/project/321/interface/api/33922
 */
export function getLabels(params: any) {
  return get('/dataWarehouse/label/list', { ...params }, { isMock: false, mockId: 321, needHint: true });
}


export function getTenantPlaceList(page: number, size: number, searchParams?: SearchParams): Promise<Response> {
  return post('/tenant/place/page', { page, size, ...searchParams }, { proxyApi: '/res', needHint: true });
}

export function getResList(page: number, size: number, searchParams?: SearchParams): Promise<Response> {
  return post('/tenant/spot/page', { page, size, ...searchParams, permission: false }, { proxyApi: '/res', needHint: true });

}

/*
*【场地详情】场地关联的角色列表
* https://yapi.lanhanba.com/project/399/interface/api/41229
*/
export function getPlaceRoleList(params: any): Promise<Response> {
  return post('/tenant/place/role/relation/list', params, { proxyApi: '/res', needHint: true });
}

/*
 * 场地提交审核【HTTP】
 * https://yapi.lanhanba.com/project/321/interface/api/41544
*/
export function postPlaceCreate(info: CreateInfo): Promise<boolean> {
  return post('/place/examine/create', info, { isMock: false, mockId: 321, needHint: true });
}
/*
 * 点位提交审核【HTTP】
 * https://yapi.lanhanba.com/project/321/interface/api/41551
*/
export function postSpotCreate(info): Promise<boolean> {
  return post('/spot/examine/create', info, { isMock: false, mockId: 321, needHint: true });
}
