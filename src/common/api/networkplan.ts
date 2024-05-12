import { get, post } from '../request';

/**
 * 地图商圈聚合
 * https://yapi.lanhanba.com/project/546/interface/api/59618
 */
export function getAreaMapData(params:any) {
  return post('/plan/area/map', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}
/**
 * 地图商圈聚合
 * https://yapi.lanhanba.com/project/546/interface/api/70307
 */
export function getCollectMapData(params:any) {
  return post('/plan/spot/area/map', params);
}
/**
 * 无文档 与上面一致
 */
export function getBusinessAreaMapData(params:any) {
  return post('/modelCluster/area/map', params,);
}

/**
 * 地图商圈列表
 * https://yapi.lanhanba.com/project/546/interface/api/59660
 */
export function getPlanAreaList(params:any) {
  return post('/plan/area/list', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}
/**
 * 无文档，与上面一致
 */
export function getBusinessPlanAreaList(params:any) {
  return post('/modelCluster/area/list', params);
}

/**
 * @params module 1 网规相关，2行业商圈 （通用版）
 * 下拉选项
 * https://yapi.lanhanba.com/project/546/interface/api/60129
 */
export function getSelection(params) {
  return post('/plan/selection', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false,
  });
}

/**
 * 审批详情-分公司网规统计指标
 * https://yapi.lanhanba.com/project/546/interface/api/60367
 */
export function getDetail(params) {
  return post('/plan/index/approve', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 门店列表
 * https://yapi.lanhanba.com/project/546/interface/api/60493
 */
export function getStoreList(params) {
  return post('/plan/store/list', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 查询门店成功/失败图表数据
 * https://yapi.lanhanba.com/project/546/interface/api/60507
 */
export function getStoreChart(params) {
  return post('/planStore/chart', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 根据条件批量查询成功率
 * https://yapi.lanhanba.com/project/546/interface/api/60612
 */
export function getStoreRateSuccess(params) {
  return post('/planStore/rate/success', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

// /**
//  * 根据条件批量查询成功率
//  * https://yapi.lanhanba.com/project/546/interface/api/60612
//  */
// export function getPlanTree(params) {
//   return post('/planStore/rate/success', params, {
//     isMock: false,
//     mockId: 546,
//     mockSuffix: '/api',
//     needHint: true,
//   });
// }

/**
 * 获取树结构选项值
 * https://yapi.lanhanba.com/project/546/interface/api/60353
 */
export function getTreeSelection(params) {
  return post(`/plan/treeSelection`, params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
    needCancel: false
  });
}

/**
 * 搜索周边商圈
 * https://yapi.lanhanba.com/project/546/interface/api/61389
 */
export function getNearArea(params) {
  return post(`/plan/area/searchNear`, params);
}

/**
 * 设为规划
 * https://yapi.lanhanba.com/project/546/interface/api/61466
 */
export function setPlannedArea(params) {
  return post(`/plan/area/set`, params);
}

/**
 * 地图筛选分页列表
 * https://yapi.lanhanba.com/project/546/interface/api/61872
 */
export function getAreaPaging(params) {
  return post(`/plan/area/page`, params);
}
/**
 * 无文档 与上面一致
 */
export function getBusinessAreaPaging(params) {
  return post(`/modelCluster/area/page`, params);
}

/**
 * 总公司规划列表
 * https://yapi.lanhanba.com/project/546/interface/api/62054
 */

export function getPlanClusterCompanyPlanList(params) {
  return post('/planCluster/company/plan/list', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 规划商圈详情
 * https://yapi.lanhanba.com/project/546/interface/api/61921
 */
export function getPlanClusterDetail(params) {
  return get(`/planCluster/detail`, params);
}
/**
 *  无文档，参数同上,用于获取行业商圈（益禾堂）详情
 */
export function getPlanDetail(params) {
  return get(`/planCluster/common/detail`, params);
}

/**
 * 筛选项搜索区间信息
 * https://yapi.lanhanba.com/project/546/interface/api/62110
 */

export function getPlanClusterSearchInfo(params) {
  return post('/planCluster/search/info', params, {
    isMock: false,
    mockId: 546,
    mockSuffix: '/api',
    needHint: true,
  });
}

/**
 * 规划权限
 * https://yapi.lanhanba.com/project/546/interface/api/61802
 */
export function getPermission() {
  return get(`/plan/permission`, null);
}

/**
 * 规划商圈列表统计
 * https://yapi.lanhanba.com/project/546/interface/api/62124
 */
export function getStatisticsInfo(params) {
  return post(`/planCluster/pages/statistics`, params);
}
export function getBusinessStatisticsInfo(params) {
  return post(`/modelCluster/pages/statistics`, params);
}

/**
 * 地图筛选分页列表统计
 * https://yapi.lanhanba.com/project/546/interface/api/63748
 */
export function getMapStatisticsInfo(params) {
  return post(`/plan/area/page/statistics`, params);
}
/**
 * 分公司规划列表 导出excel功能
 * https://yapi.lanhanba.com/project/546/interface/api/62292
 */
export function exportNetworkExcel(params) {
  return post(`/planCluster/company/plan/export`, params);
}


/**
 * 加入规划
 * https://yapi.lanhanba.com/project/546/interface/api/59800
 */
export function addToPlan(params) {
  return post(`/plan/add`, params);
}

/**
 * 取消规划
 * https://yapi.lanhanba.com/project/546/interface/api/60108
 */
export function cancelThePlan(params) {
  return post(`/plan/cancel`, params);
}

/**
 * 商圈围栏列表
 * https://yapi.lanhanba.com/project/546/interface/api/63153
 */
export function getPolygon(params) {
  return post(`/plan/area/polygon/list`, params, { needCancel: false });
}

/**
 * 无文档，参数与上面一致
 */
export function getBusinessPolygon(params) {
  return post(`/modelCluster/area/polygon/list`, params, { needCancel: false });
}
/**
 * 重新匹配更新网络规划
 * https://yapi.lanhanba.com/project/546/interface/api/63258
 */
export function updatePlan() {
  return post(`/plan/update`, {});
}

/**
 * 规划商圈详情（适用recommend/industrycircle和recommend/industrybusiness）
 * 同：https://yapi.lanhanba.com/project/546/interface/api/61921
 */
export function getModelClusterDetail(params) {
  return get(`/modelCluster/detail`, params);
}

/**
 * 创建规划商圈
 * https://yapi.lanhanba.com/project/546/interface/api/60409
 */
export function createPlanCluster(params) {
  return post(`/planCluster/create`, params);
}

/**
 * 为当前用户收藏/取消收藏商圈
 * https://yapi.lanhanba.com/project/546/interface/api/64021
 */
export function postModelClusterFavor(params) {
  return post(`/modelCluster/favourite`, params);
}

/**
 * 行业商圈-商圈列表（通用版: /recommend/industrycircle）
 * https://yapi.lanhanba.com/project/546/interface/api/64994
 */
export function industryCircleList(params) {
  return post(`/modelCluster/es/area/page`, params);
}

/**
 * 行业商圈-商圈省市区聚合列表（通用版: /recommend/industrycircle）
 * https://yapi.lanhanba.com/project/546/interface/api/65064
 */
export function industryCircleClusterList(params) {
  return post(`/modelCluster/es/area/map`, params);
}

/**
 * 行业商圈-商圈区域列表（通用版: /recommend/industrycircle）
 * https://yapi.lanhanba.com/project/546/interface/api/65057
 */
export function industryCircleDistrictList(params) {
  return post(`/modelCluster/es/area/polygon/list`, params);
}

/**
 * 删除新增商圈
 * https://yapi.lanhanba.com/project/546/interface/api/63832
 */
export function deleteCluster(params) {
  return post(`/planCluster/delete`, params);
}


/**
 * 规划商圈容量列表
 * https://yapi.lanhanba.com/project/546/interface/api/65456
 */
export function getCapacityPages(params) {
  return post(`/planCluster/capacity/pages`, params);
}

/**
 * 规划商圈容量统计
 * https://yapi.lanhanba.com/project/546/interface/api/65596
 */
export function getCapacityPagesTotal(params) {
  return post(`/planCluster/capacity/statistics`, params);
}

/**
 * 地图容量列表
 * https://yapi.lanhanba.com/project/546/interface/api/65484
 */
export function getCapacityArea(params) {
  return post(`/plan/area/capacity`, params);
}

/**
 * 选址地图页-/iterate/siteselectionmap 获取区以下数据（分页）
 * https://yapi.lanhanba.com/project/546/interface/api/67605
 */
export function geUnderTheDistrictPagingData(params) {
  return post(`/modelCluster/es/area/polygon/pageList`, params, {
    needCancel: false
  });
}

/**
 * 热门标签列表
 * https://yapi.lanhanba.com/project/546/interface/api/67626
 */
export function getHotLabel() {
  return post(`/modelClusterLabel/hot/labels`);
}
/**
 * 规划商圈列表
 * https://yapi.lanhanba.com/project/546/interface/api/60136
 */
export function getPlanCluster(params) {
  return post(`/planCluster/pages`, params);
}

/**
 * 生效后-添加规划商圈
 * https://yapi.lanhanba.com/project/546/interface/api/67906
 */
export function addCluster(params) {
  return post(`/planCluster/add`, params);
}

/**
 * 生效后-取消添加的规划商圈
 * https://yapi.lanhanba.com/project/546/interface/api/67913
 */
export function cancelCluster(params) {
  return post(`/planCluster/cancel`, params);
}

/**
 * 获取当前租户能选择的某种类型的所有标签
 * https://yapi.lanhanba.com/project/546/interface/api/67829
 */
export function getLabels(params) {
  return post(`/modelClusterLabel/labels`, params, {
    needCancel: false
  });
}

/**
 * 获取某商圈当前租户的所有标签绑定关系
 * https://yapi.lanhanba.com/project/546/interface/api/67801
 */
export function getLabelRelations(params) {
  return post(`/modelClusterLabel/modelCluster/relations`, params, {
    needCancel: false
  });
}

/**
 * 为租户新增商圈自定义标签(无绑定功能)
 * https://yapi.lanhanba.com/project/546/interface/api/67612
 */
export function createCustomLabels(params) {
  return post(`/modelClusterLabel/createCustomLabel`, params);
}

/**
 * 为租户全量更新某种类型的标签绑定关系（非系统标签）
 * https://yapi.lanhanba.com/project/546/interface/api/67794
 */
export function saveLabelRelations(params) {
  return post(`/modelClusterLabel/saveRelations`, params, {
    needCancel: false
  });
}

/**
 * 为租户增加自定义标签绑定关系
 * https://yapi.lanhanba.com/project/546/interface/api/67745
 */
export function addCustomLabelRelations(params) {
  return post(`/modelClusterLabel/addCustomRelations`, params);
}

/**
 * 左侧筛选-暂无文档
 */
export function receiveSession() {
  return post(`/modelCluster/es/selection/list`);
}

/**
 * 人口年龄性别人口性别年龄占比
 * https://yapi.lanhanba.com/project/546/interface/api/68396
 */

export function getModelClusterPopulation(params) {
  return post(`/modelCluster/population`, params);
}



/**
 * 人口年龄性别人口性别年龄占比
 * https://yapi.lanhanba.com/project/546/interface/api/68396
 */

export function getModelClusterOverView(params) {
  return post(`/modelCluster/overview`, params);
}


/**
 * 商圈业态
 * https://yapi.lanhanba.com/project/546/interface/api/68494
 */

export function getModelClusterSituation(params) {
  return post(`/modelCluster/situation`, params);
}

/**
 * 获取高德poi
 * https://yapi.lanhanba.com/project/413/interface/api/68753
 */
export function getPoi(params) {
  return post(`/amap/getPoi`, params);
}

/**
 * 集客点地图-商圈page
 * https://yapi.lanhanba.com/project/546/interface/api/70272
 */
export function getMapPage(params) {
  return post(`/plan/spot/planCluster/map/page`, params);
}

/**
 * 集客点地图-统计
 * https://yapi.lanhanba.com/project/546/interface/api/70300
 */
export function getStatistic(params) {
  return post(`/plan/spot/statistic`, params);
}
/**
 * 录入的集客点详情
 * https://yapi.lanhanba.com/project/546/interface/api/59667
 */
export function getSpotDetail(params) {
  return get(`/plan/spot/relation/detail`, params);
}
/**
 * 集客点规划商圈详情
 * https://yapi.lanhanba.com/project/546/interface/api/59975
 */
export function getClusterDetail(params) {
  return get(`/plan/spot/cluster/detail`, params);
}

/**
 * 点位详情
 * https://yapi.lanhanba.com/project/546/interface/api/70181
 */
export function getMallLocationDetail(params) {
  return get(`/modelCluster/mallLocation/detail`, params);
}


/**
 * 商圈报告首页
 * https://yapi.lanhanba.com/project/546/interface/api/70923
 */
export function areaReportHomeData(params) {
  return get(`/modelCluster/frontPage`, params);
}


/**
 * 查询pdf导出状态
 * https://yapi.lanhanba.com/project/546/interface/api/71000
 */
export function getPDFExportStatus(params) {
  return post(`/standard/pdf/export/status`, params);
}


