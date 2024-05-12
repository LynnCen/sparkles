/**
 * 多个页面会使用的公共接口
 */
import { get, post } from '@/common/request/index';
export interface StoreListItem {
  /**
   * 门店id
   */
  id: number;
  /**
   * 门店名称
   */
  name: string;
  /**
   * 是否开启回放   1：开启 0：关闭
   */
  playbackStatus: number;
}

/**
 * 租户列表：https://yapi.lanhanba.com/project/297/interface/api/33441
 */
export function tntList() {
  return get('/tntList', {}, true);
}

/**
 * 获取验证码：https://yapi.lanhanba.com/project/297/interface/api/33438
 */
export function sendCaptcha(params: Record<string, any>) {
  return get('/sendCode', params, true);
}


/**
 * 企业微信登陆--获取重定向链接 https://yapi.lanhanba.com/project/297/interface/api/59331
 */
export function getWxOauth2AuthorizeUri(params) {
  return get('/getWxOauth2AuthorizeUri', { ...params }, true);
}

/**
 * 企业微信登陆--通过授权码登陆 https://yapi.lanhanba.com/project/297/interface/api/59338
 */
export function loginByWxCode(params) {
  return post('/loginByWxCode', { ...params }, true);
}

/**
 * 获取门店列表： https://yapi.lanhanba.com/project/297/interface/api/33299
 */
export function storesList(params: Record<string, any>) {
  return get('/store/search', params, true);
}

/**
 * 下拉框选项
 * https://yapi.lanhanba.com/project/297/interface/api/33470
 */

export function dictionaryTypeItems(params?: any) {
  return get('/dictionaryType/items', { ...params });
}

/**
 * 行政区域
 * https://yapi.lanhanba.com/project/297/interface/api/33601
 */

export function areaList(params?: any) {
  return get('/area/list', { ...params }, { needCancel: false });
}

/**
 * 七牛token
 * https://yapi.lanhanba.com/project/297/interface/api/34045
 */
export function getQiNiuToken(params: any) {
  return get('/qiniu/getToken', { ...params }, { needCancel: false });
}

/**
 * 筛选项
 * https://yapi.lanhanba.com/project/335/interface/api/34051
 */
export function commonSelection(params: any) {
  return post('/common/selection', { ...params });
}

/**
 * 储备店筛选项
 * https://yapi.lanhanba.com/project/353/interface/api/37064
 */
export function expandShopSelection(params: any) {
  return post('/expandShop/reserveStore/selection', { ...params });
}

/**
 * 亚瑟士-储备店筛选项
 * https://yapi.lanhanba.com/project/353/interface/api/46171
 */
export function expandShopAsicsSelection(params: any) {
  return post('/expandShop/reserveStore/asics/selection', { ...params });
}

/**
 * 品牌列表
 * https://yapi.lanhanba.com/project/329/interface/api/35153
 */
export function brandList(params: any) {
  return post(
    '/brand/list',
    { ...params },
    {
      isMock: false,
      mockId: 329,
      needHint: true,
      needCancel: false,
    }
  );
}

/**
 * 新增品牌
 * https://yapi.lanhanba.com/project/329/interface/api/35146
 */
export function createBrand(params: any) {
  return post(
    '/brand/create',
    { ...params },
    {
      isMock: false,
      mockId: 329,
      needHint: true,
    }
  );
}

/**
 * 行业列表
 * https://yapi.lanhanba.com/project/297/interface/api/34312
 */
export function industryList(params: any) {
  return get(
    '/industry/list',
    { ...params },
    {
      isMock: false,
      mockId: 297,
      mockSuffix: '/api',
      needHint: true,
      needCancel: false,
    }
  );
}


/**
 * 行业列表（对外开发，无需token）
 * https://yapi.lanhanba.com/project/335/interface/api/34359
 */
export function postSelectionTree(params: any) {
  return post(
    '/common/selection/tree',
    { ...params },
    {
      isMock: false,
      mockId: 335,
      mockSuffix: '/api',
      needHint: true,
      needCancel: false,
    }
  );
}

/**
 * 场地列表
 * https://yapi.lanhanba.com/project/329/interface/api/35111
 */
export function placeList(params: any) {
  return post(
    '/place/list',
    { ...params },
    {
      isMock: false,
      mockId: 329,
      needHint: true,
      needCancel: false,
    }
  );
}

/**
 * 新增场地
 * https://yapi.lanhanba.com/project/329/interface/api/35132
 */
export function createPlace(params: any) {
  return post(
    '/place/create',
    { ...params },
    {
      isMock: false,
      mockId: 329,
      needHint: true,
    }
  );
}

/**
 * 场地类目列表
 * https://yapi.lanhanba.com/project/329/interface/api/35160
 */
export function placeCategoryList(params: any) {
  return post(
    '/category/list',
    { ...params },
    {
      isMock: false,
      mockId: 329,
      needHint: true,
    }
  );
}

/**
 * 校验企业
 * https://yapi.lanhanba.com/project/297/interface/api/41208
 */
export function tenantCheck() {
  return get('/tenant/check', {}, {
    needCancel: false,
    isMock: false });
};

/**
 * 获取分享链接 -短链接
 * https://yapi.lanhanba.com/project/349/interface/api/44141
 */
export function getLink(params:any) {
  return post(`/share/link/create`, params);
}

/**
 * 获取自定义table表头
 * https://yapi.lanhanba.com/project/378/interface/api/46017
 */
export function getConfigCustomField(params) {
  return get(`/account/config/findCustomField`, params, {
    isMirage: true
  });
  // /account/config/findCustomField
}

/**
 * 编辑自定义表头
 * ！！！module需要前端自己定义，命名规则 loc + 路由path(/为分隔符，首字母大写)，定义完成后一定要去yapi中添加此key，并手动检查新添加的key是否重复！！！
 * 例如：选址大脑菜单下的转化率洞察 路由：/brain/conversioninsight，那么对应的module名就为：locBrainConversioninsight
 * 如果当前页有多个Table时，可拼接具体的Table名
 * 例如：系统管理/选址地图配置/行业地图配置 路由：system/industryMap，那么对应重点商圈信息Tab下的Table的module名就为：
 * locSystemIndustryMapArea
 * https://yapi.lanhanba.com/project/378/interface/api/45079
 */
export function postConfigCustomField(params) {
  return post(`/account/config/customField`, params, {
    isMirage: true
  });
}

/**
 * 根据高德code返回数据库中对应的省市区信息
 * @param {Object} params { code: string, cityName: string }
 * @returns {Object}
 * return {
 *   provinceId: xx,
 *   provinceName: xx,
 *   cityId: xx,
 *   cityName: xx,
 *   districtId: xx,
 *   districtName: xx
 * }
 */
export function codeToPCD(params) {
  return get(`/area/search/code`, params, {});
}

/**
 * 租户下的分公司列表
 * https://yapi.lanhanba.com/project/532/interface/api/59128 zdj 文档让后端生成
 */
export function getCompanyList() {
  return post(`/company/list`, {}, {
    isMock: false,
    needHint: true,
  });
}

/**
 * 指派人列表
 * https://yapi.lanhanba.com/project/532/interface/api/61459
 */
export function getEmployeeList(params) {
  return post(`/standard/employee/list`, { ...params }, {
    isMock: false,
    needHint: true,
  });
}

/**
 * 获取城市id（cityIds)
 */
export function getCityIds() {
  return post(`/industry/permission/cities`);
}
