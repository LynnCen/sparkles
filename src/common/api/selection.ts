import { get, post } from '@/common/request/index';

/**
 * 根据城市名查询id，辅助功能接口
 * https://yapi.lanhanba.com/project/297/interface/api/34509
 */
export function fetchCityIdByName(params: any) {
  return get('/area/city/search', { ...params }, {
    // 这里的needCancel不要注释，在有些地图页里不同的组件都会用到该接口
    needCancel: false
  });
}

/**
 * 查询poi地图页面左侧的选项树-旧版  在系统管理品牌添加处仍在使用
 * https://yapi.lanhanba.com/project/335/interface/api/34359
 */
export function selectionTreeByKey(params?: any) {
  return post('/common/selection/tree', { ...params }, {
    isMock: false,
    mockId: 335,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * poi地图-品牌分类树
 * https://yapi.lanhanba.com/project/349/interface/api/40214
 */
export function selectionNewTree(params?: any) {
  return get('/shop/map/category/tree', { ...params }, {
    isMock: false,
    mockId: 335,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * poi地图-查询poi地图页面区域数量
 * https://yapi.lanhanba.com/project/349/interface/api/34486
 */
export function poiCount(params?: any) {
  return post('/shop/map/poi/count', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * poi地图-查询poi地图页面区域数量
 * https://yapi.lanhanba.com/project/349/interface/api/34485
 */
export function poiMap(params?: any) {
  return post('/shop/map/poi', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 行业地图-行业地图品牌点位（区）
 * https://yapi.lanhanba.com/project/349/interface/api/39815
 */
export function fetchMapDistrict(params: any) {
  return post('/industry/brand/map', { ...params });
}
/**
 * 行业地图-行业地图品牌点位(区)--分享页
 * https://yapi.lanhanba.com/project/349/interface/api/43336
 */
export function fetchMapDistrictShare(params: any) {
  return post('/share/industry/brand/map', { ...params }, {
    needCancel: false
  });
}
/**
 * 行业地图-行业地图数量（汇总数据）
 * https://yapi.lanhanba.com/project/349/interface/api/39822
 */

export function getBrandCluster(params: any) {
  return post('/industry/brand/map/count', { ...params }, {
    needHint: true
  });
}
/**
 * 行业地图-行业地图数量（汇总数据）--分享页
 * https://yapi.lanhanba.com/project/349/interface/api/43357
 */

export function getBrandClusterShare(params: any) {
  return post('/share/industry/brand/map/count', { ...params }, {
    needCancel: false,
  });
}
/**
 * 行业地图-右侧选项-行业品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/39829
 */

export function fetchBrandList(params: any) {
  return post('/industry/brand/list', { ...params });
}
/**
 * 行业地图-右侧选项-行业品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/39829
 */

export function fetchBrandListShare(params: any) {
  return post('/share/industry/brand/list', { ...params }, {
    // needCancel: false
  });
}
/**
 * 行业地图-左侧树-行业品牌列表（省市区联动）
 * https://yapi.lanhanba.com/project/349/interface/api/39913
 */

export function fetchBrandCount(params: any) {
  return post('/industry/brand/count', { ...params });
}

/**
 * 行业地图-左侧树-重点商圈列表
 * https://yapi.lanhanba.com/project/349/interface/api/39836
 */

export function fetchAreaList() {
  // 原先为post
  return get('/industry/area/list');
};

/**
 * 行业地图-左侧树-重点商圈列表
 * https://yapi.lanhanba.com/project/349/interface/api/43539
 */

export function fetchAreaListShare(params:any) {
  return get('/share/industry/area/list', { ...params }, {
    // needCancel: false
  });
};
/**
 * 行业地图-地图商圈列表
 * https://yapi.lanhanba.com/project/349/interface/api/40900
 */
export function areaMap(params?: any) {
  return post('/industry/area/map', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}
/**
 * 行业地图-地图商圈列表--分享页
 * https://yapi.lanhanba.com/project/349/interface/api/43364
 */
export function areaMapShare(params?: any) {
  return post('/share/industry/area/map', { ...params }, {
    needCancel: false
  });
}

/**
 * 行业地图-商圈聚合
 * https://yapi.lanhanba.com/project/349/interface/api/41992
 */
export function getAreaCluster(params?: any) {
  return post('/industry/area/map/count', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}
/**
 * 行业地图-商圈聚合--分享页
 * https://yapi.lanhanba.com/project/349/interface/api/43371
 */
export function getAreaClusterShare(params?: any) {
  return post('/share/industry/area/map/count', { ...params }, {
    // needCancel: false
  });
}
/**
 * 行业地图-城市信息
 * https://yapi.lanhanba.com/project/349/interface/api/42006
 */
export function getCityAreaInfoByCityId(params: any) {
  return get('/industry/city', { ...params });
}

/**
 * poi地图-品牌点位
 * https://yapi.lanhanba.com/project/349/interface/api/39773
 */
export function brandMap(params?: any) {
  return post('/shop/map/brand', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * poi地图-品牌地图数量
 * https://yapi.lanhanba.com/project/349/interface/api/39801
 */
export function brandCount(params?: any) {
  return post('/shop/map/brand/count', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * babycare全国热力图和点位文件地址
 * https://yapi.lanhanba.com/project/441/interface/api/41278
 */
export function heatDemoCountry(params?: any) {
  return get('/demo/country', { ...params }, { needCancel: false });
}

/**
 * babycare省热力图和点位文件地址
 * https://yapi.lanhanba.com/project/441/interface/api/41292
 */
export function heatDemoProvince(params?: any) {
  return get('/demo/province', { ...params }, { needCancel: false });
}

/**
 * 行业地图-特殊关注品牌搜索
 * https://yapi.lanhanba.com/project/349/interface/api/41516
 */
export function attentionBrand(params?: any) {
  return get('/attention/brand/search', { ...params }, { needCancel: false });
}
/**
 * 行业地图-特殊关注品牌搜索--分享页
 * https://yapi.lanhanba.com/project/349/interface/api/43378
 */
export function attentionBrandShare(params?: any) {
  return get('/share/attention/brand/search', { ...params }, { needCancel: false });
}

/**
 * 行业地图权限控制
 * https://yapi.lanhanba.com/project/349/interface/api/42328
 */
export function getIndustryPermissionList() {
  return get('/industry/permission/list', {});
}
/**
 * 门店地图-左侧树个数
 * https://yapi.lanhanba.com/project/349/interface/api/41747
 */
export function storeTree(params?: any) {
  return get('/map/shop/attribute/count', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api',
    needHint: true
  });
}

/**
 * 门店地图-聚合数量
 * https://yapi.lanhanba.com/project/349/interface/api/41789
 */

export function storeCount(params?: any) {
  return get('/map/shop/area/count', { ...params });
}

/**
 * 门店地图-点位信息
 * https://yapi.lanhanba.com/project/349/interface/api/41768
 */

export function storePoint(params?: any) {
  return get('/map/shop/search', { ...params });
}

/**
 * 新版poi地图行业、品牌树状数据
 * https://yapi.lanhanba.com/project/349/interface/api/43420
 */
export function poiTreeBrand(params: any) {
  return get('/poi/map/industry/brand', { ...params }, {
    isMock: false,
    mockId: 349,
    mockSuffix: '/api'
  });
}

/**
 * 新版poi地图右侧数据看板
 * https://yapi.lanhanba.com/project/349/interface/api/43588
 */
export function poiBoardBrand(id: number) {
  return get('/poi/map/industry/distribute', { industryId: id });
}

/**
 * 新版poi地图分组饼图
 * https://yapi.lanhanba.com/project/349/interface/api/43665
 */
export function poiBrandDistribution(params: any) {
  return post('/poi/map/brand/count', { ...params });
}

/**
 * 新版poi地图区级品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/43483
 */
export function poiMapBrandList(params: any) {
  return post('/poi/map/shop/list', { ...params });
}

/**
 * 新版poi地图行业省市区行业个数
 * https://yapi.lanhanba.com/project/349/interface/api/43434
 */
export function poiCollectIndustry(params: any) {
  return post('/poi/map/industry/count', { ...params });
}

/**
 * 新版poi地图根据行业获取对应的品牌列表
 * https://yapi.lanhanba.com/project/349/interface/api/47151
 */
export function poiIndustryBrand(params: any) {
  return get('/poi/map/industry/brand/list', { ...params });
}

/**
 * @description 热力查询
 * @yapi https://yapi.lanhanba.com/project/511/interface/api/56391
 */
export function getHeatMapList(params?:any) {
  return post('/heat/map/data', { ...params }, {
    isMock: false,
    mockId: 511,
    mockSuffix: '/api',
    needHint: true,
  });
}

/*
 * 行业品牌主力省份城市前3数量
 * https://yapi.lanhanba.com/project/349/interface/api/56601
 */
export function brandRankData(params: any) {
  return post('/industry/brand/main/area/count', { ...params });
}


/**
 * 餐饮热力图
 * https://yapi.lanhanba.com/project/546/interface/api/68074
 */
export function getFoodHeapMap(params:any) {
  return post(`/heat/map/food`, params);
}
