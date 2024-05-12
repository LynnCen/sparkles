import { get, post } from '@/common/request/index';
import { TenantHomeConfig } from '@/views/location/pages/tenantdetail/components/HomeConfig/ts.config';

/**
 * location 企业账号管理列表页下拉选项
 * https://yapi.lanhanba.com/project/289/interface/api/41446
 */

export function tenantSelectionByKey(params: any) {
  return post('/tenant/selection', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 租户分页
 * https://yapi.lanhanba.com/project/289/interface/api/41383
 */
export function tenantPagesByKey(params: any) {
  return post('/tenant/pages', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * 租户详情
 * https://yapi.lanhanba.com/project/289/interface/api/41397
 */
export function tenantDetailById(params: any) {
  return post('/tenant/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * 踩点记录列表
 * https://yapi.lanhanba.com/project/289/interface/api/41558
 */
export function tenantCheckSpotRecordPagesByKey(params: any) {
  return post('/tenant/benefit/record', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * 权益充值
 * https://yapi.lanhanba.com/project/289/interface/api/41404
 */
export function benefitRecharge(params: any) {
  return post('/tenant/benefit/recharge', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * location维护用户列表
 * https://yapi.lanhanba.com/project/289/interface/api/41439
 */
export function tenantFollower(params: any) {
  return post('/tenant/follower/pages', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * location修改跟进人
 * https://yapi.lanhanba.com/project/289/interface/api/41390
 */
export function updateFollower(params: any) {
  return post('/tenant/follower/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * 行业地图提示文案配置 https://yapi.lanhanba.com/project/289/interface/api/44372
 */
export function saveIndustryConfig(params: any) {
  return post('/tenant/setting', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 * 获取行业地图提示文案配置 https://yapi.lanhanba.com/project/289/interface/api/44379
 */
export function getIndustryConfig(params: any) {
  return post('/tenant/setting/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
};

/**
 *  已关联的品牌列表(不分页) https://yapi.lanhanba.com/project/462/interface/api/51981
 */
export function getBrandList(params:any) {
  return post('/industry/brand/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true,
    isMock: false,
    mockId: 462
  });
}

/**
 * 删除关联的品牌 https://yapi.lanhanba.com/project/462/interface/api/51995
 */
export function deleteBrand(params:any) {
  return post('/industry/brand/delete', { ...params }, {
    proxyApi: '/blaster',
    needHint: true,
    isMock: false,
    mockId: 462
  });
}

/**
 * 设为本品牌 https://yapi.lanhanba.com/project/462/interface/api/52002
 */
export function setBrandSelf(params:any) {
  return post('/industry/brand/set/self', { ...params }, {
    proxyApi: '/blaster',
    needHint: true,
    isMock: false,
    mockId: 462
  });
}

/**
 * @description 待关联的品牌列表
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/51988
 */
export function industryBrandSelectList(params?: any) {
  return post('/industry/brand/select/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 批量关联品牌
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/52009
 */
export function industryBrandAdd(params?: any) {
  return post('/industry/brand/add', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/*
 * https://yapi.lanhanba.com/project/462/interface/api/55026
 * 门店概览配置-导入的详情
*/
export function overviewShow(params?: any) {
  return get('/tenant/data/overview/show', { ...params }, {
    isMock: false,
    needHint: true,
    mockId: 462,
    proxyApi: '/blaster'
  });
};

/**
 * @des 门店概览配置-导入
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/55019
 */
export function overviewImport(params?: any) {
  return post('/tenant/data/overview/import', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 门店概览配置-删除
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/55033
 */
export function overviewDelete(params?: any) {
  return post('/tenant/data/overview/delete', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 编辑属性配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/56671
 */

export function surroundAttributeUpdate(params?: any) {
  return post('/surround/model/attribute/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}
/**
 * @des 审批流程下拉选择项目
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/58918
 */
export function getApprovalFlowOptions(params?: any) {
  return post('/flow/template/page', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}



/**
 * @des 审批流程模版列表（标准版）
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/58918
 */
export function getApprovalProceeTemplate(params?: any) {
  return post('/approval/template/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 保存审批流程模版列表（标准版）
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/58925
 */
export function saveApprovalProceeTemplate(params?: any) {
  return post('/approval/template/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 标准版机会点状态配置详情
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/58911
 */
export function getChancePointStatusConfigList(params?: any) {
  return get('/tenant/data/chancePoint/status/show', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}
/**
 * @des 拓店管理相关配置-状态重命名列表
 * @param tenantId
 */
export function getStatusRenameConfigList(params?: any) {
  return get('/tenant/data/store/status/show', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 标准版机会点状态配置详情
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/58911
 */
export function saveChancePointStaus(params?: any) {
  return post('/tenant/data/chancePoint/status/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}
/**
 * @des 拓店管理相关配置-状态重命名操作
 * @yapi
 * @param {tenantId,status,alias}
 */
export function saveStoreStatus(params?: any) {
  return post('/tenant/data/store/status/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 获取热力配置信息
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/59240
 */
export function getHeapMapConfig(params?: any) {
  return get('/tenant/data/heatMap/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 设置热力配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/59233
 */
export function setHeapMapConfig(params?: any) {
  return post('/tenant/data/heatMap/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 是否根据数据权限展示品牌开关查询
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62565
 */
export function getBrandPermissionConfig(params?: any) {
  return get('/tenant/data/showBrandByDataPermission/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 是否根据数据权限展示品牌开关配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62572
 */
export function setBrandPermissionConfig(params?: any) {
  return post('/tenant/data/showBrandByDataPermission/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 获取lbs配置信息
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/61018
 */
export function getLBSConfig(params?: any) {
  return get('/tenant/data/lbs/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 设置lbs配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/61011
 */
export function setLBSConfig(params?: any) {
  return post('/tenant/data/lbs/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 是否根据数据权限展示品牌开关查询
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62565
 */
export function getConversionFlagConfig(params?: any) {
  return get('/tenant/data/conversion/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 是否根据数据权限展示品牌开关设置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62572
 */
export function setConversionFlagConfig(params?: any) {
  return post('/tenant/data/conversion/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

// /api/tenant/data/showBrandByDataPermission/detail


/**
 *  机会点列表excel查询 https://yapi.lanhanba.com/project/462/interface/api/59310
 */
export function getChancePointTableDetail(params:any) {
  return get(`/tenant/data/chancePointTable/detail`, params, {
    proxyApi: '/blaster',
    needCancel: false,
  });
}
/**
 *  机会点列表excel url配置 https://yapi.lanhanba.com/project/462/interface/api/59303
 */
export function importChancePointTable(params:any) {
  return post(`/tenant/data/chancePointTable/import`, params, {
    proxyApi: '/blaster',
  });
}

/**
 *  机会点模板详情 https://yapi.lanhanba.com/project/462/interface/api/62719
 *  @param tenantId
 *  @param type 1 :门店运营-概览 2 :标准版机会点状态 3 :热力图开关 4 :机会点列表动态配置 5 :加盟商列表动态配置 6 :规划模型 10 :LBS付费引导入口 11 :转化率洞察引导入口 12 :转化率洞察引导入口 13 :标准版机会点导出模板
 */
export function getChancePointTemplateDetail(params:any) {
  return post(`/tenant/data/chancePointTemplate/detail`, params, {
    proxyApi: '/blaster',
  });
}
/**
 *  机会点模板导入 https://yapi.lanhanba.com/project/462/interface/api/62712
 * @param tenantId
 * @param url
 * @param urlName
 * @param type 1 :门店运营-概览 2 :标准版机会点状态 3 :热力图开关 4 :机会点列表动态配置 5 :加盟商列表动态配置 6 :规划模型 10 :LBS付费引导入口 11 :转化率洞察引导入口 12 :转化率洞察引导入口 13 :标准版机会点导出模板
 */
export function importChancePointTemplate(params:any) {
  return post(`/tenant/data/chancePointTemplate/import`, params, {
    proxyApi: '/blaster',
  });
}

/**
 * @des 门店数据导入
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/61228
 */
export function shopDataImport(params?: any) {
  return post('/tenant/standardShop/importExcel', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 门店数据导入
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/61235
 */
export function shopDataImportRecord(params?: any) {
  return post('/tenant/standardShop/importRecord', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务类型-列表（不分页，返回全部）
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62733
 */
export function taskTypeList(params?: any) {
  return get('/task/type/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务类型-保存
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62740
 */
export function taskTypeSave(params?: any) {
  return post('/task/type/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务类型-删除
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62726
 */
export function taskTypeDelete(params?: any) {
  return post('/task/type/delete', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务类型-更新
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/62747
 */
export function taskTypeUpdate(params?: any) {
  return post('/task/type/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 选址模型分页
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63937
 */
export function getSiteModelPage(params?: any) {
  return get('/site_model/page', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 选址模型list
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63944
 */
export function getSiteModelList(params?: any) {
  return get('/site_model/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 增加 选址模型
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63965
 */
export function addSiteModel(params?: any) {
  return post('/site_model/add', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 修改 选址模型
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63972
 */
export function updateSiteModel(params?: any) {
  return post('/site_model/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 删除 选址模型
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63979
 */
export function deleteSiteModel(params?: any) {
  return post('/site_model/delete', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 为租户设置选址模型
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63986
 */
export function saveTenantSiteModel(params?: any) {
  return post('/tenant/data/siteModel/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 获取租户的选址模型配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/63993
 */
export function getTenantSiteModel(params?: any) {
  return post('/tenant/data/siteModel/get', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 加盟商模版创建
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/59457
 */
export function createFranchiseeTemplate(params?: any) {
  return post('/dynamic/franchisee/template/info/create', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 加盟商模版更新
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/59464
 */
export function updateFranchiseeTemplate(params?: any) {
  return post('/dynamic/franchisee/template/info/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 禁用/启用加盟商模版
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/59506
 */
export function enableFranchiseeTemplate(params?: any) {
  return post('/dynamic/franchisee/template/enable', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 加盟商模版列表
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/59471
 */
export function franchiseeTemplateList(params?: any) {
  return post('/dynamic/franchisee/template/lists', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 动态模板详情
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/47333
 */
export function dynamicTemplateDetail(params?: any) {
  return post(
    '/dynamic/template/detail',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 动态模板添加分组
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/47340
 */
export function dynamicTemplateAddGroup(params?: any) {
  return post(
    '/dynamic/group/add',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 编辑分组属性
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/47361
 */
export function dynamicTemplateUpdateProperty(params?: any) {
  return post(
    '/dynamic/property/update',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 动态模板分组排序（接口文档没找到，从现有代码里迁移出来的）
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/xxx
 */
export function dynamicTemplateGroupReorder(params?: any) {
  return post(
    '/dynamic/group/reorder',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 动态模板字段排序（接口文档没找到，从现有代码里迁移出来的）
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/xxx
 */
export function dynamicTemplatePropertyReorder(params?: any) {
  return post(
    '/dynamic/property/reorder',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}


/**
 * @des 动态模板分组删除
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/47347
 */
export function dynamicTemplateGroupDelete(params?: any) {
  return post(
    '/dynamic/group/delete',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 动态模板字段删除
 * @yapi https://yapi.lanhanba.com/project/289/interface/api/47368
 */
export function dynamicTemplatePropertyDelete(params?: any) {
  return post(
    '/dynamic/property/delete',
    { ...params },
    {
      isMock: false,
      mockId: 289,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 加盟商excel模板
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/59555
 */
export function franchiseeTableThead(params?: any) {
  return get(
    '/tenant/data/franchiseeTable/detail',
    { ...params },
    {
      isMock: false,
      mockId: 462,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}

/**
 * @des 加盟商列表表头excel导入
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/59548
 */
export function franchiseeTableImport(params?: any) {
  return post(
    '/tenant/data/franchiseeTable/import',
    { ...params },
    {
      isMock: false,
      mockId: 462,
      mockSuffix: '/api',
      needHint: true,
      proxyApi: '/blaster',
    }
  );
}



/**
 * @des 获取数据迁移配置信息
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/68410
 */
export function getMigrationConfig(params?: any) {
  return get('/tenant/data/syncData/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 设置数据迁移配置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/68417
 */
export function setMigrationConfig(params?: any) {
  return post('/tenant/data/syncData/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 获取商圈行业列表
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/69474
 */
export function getAreaIndustrySelection(params?: any) {
  return get('/tenant/data/area/industries', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 获取行业配置配置信息
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/69481
 */
export function getAreaIndustryConfig(params?: any) {
  return get('/tenant/data/area/industry/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}


/**
 * @des 商圈行业配置设置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/69488
 */
export function setAreaIndustryConfig(params?: any) {
  return post('/tenant/data/area/industry/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}
/*
* 租户配置初始化状态查询
* https://yapi.lanhanba.com/project/462/interface/api/69502
*/
export function copyStatus(params) {
  return post(`/tenant/statusOfCopy`, params,
    {
      proxyApi: '/blaster',
      needCancel: false
    });
}

/**
* 租户配置初始化
* https://yapi.lanhanba.com/project/462/interface/api/69502
*/
export function tenantCopy(params) {
  return post(`/tenant/copyTenantConfig`, params, { proxyApi: '/blaster', });
}

/**
* 定制组件导入记录
* https://yapi.lanhanba.com/project/289/interface/api/69866
*/
export function customControlTypeRecords(params) {
  return post(`/dynamic/customControlTypeRecords`, params, { proxyApi: '/blaster', });
}

/**
* 主页配置详细信息
* https://yapi.lanhanba.com/project/462/interface/api/70335
*/
interface getHomeConfigDetailParams{
  tenantId:number
}
export function getHomeConfigDetail(params: getHomeConfigDetailParams) {
  return get('/tenant/data/home/config/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}
/**
* 主页配置详细更新
* https://yapi.lanhanba.com/project/462/interface/api/70328
*/
interface updateHomeConfigDetailParams{
  tenantId:number,
  tenantHomeConfig:Array<TenantHomeConfig>
}
export function updateHomeConfigDetail(params: updateHomeConfigDetailParams) {
  return post('/tenant/data/home/config/update', { ...params }, {
    proxyApi: '/blaster',
    needHint: true
  });
}

/**
 * @des 拓店任务模板列表
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/71329
 */
export function getTaskTemplateList(params?: any) {
  return get('/task/template/list', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务模板设置
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/71343
 */
export function taskTemplateSave(params?: any) {
  return post('/task/template/save', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}

/**
 * @des 拓店任务模板查询
 * @yapi https://yapi.lanhanba.com/project/462/interface/api/71357
 */
export function getTaskTemplateDetail(params?: any) {
  return get('/task/template/detail', { ...params }, {
    proxyApi: '/blaster',
    needHint: true });
}
