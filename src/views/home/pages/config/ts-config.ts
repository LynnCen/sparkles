/**
 * 首页配置父模块ID枚举
 */
export enum HomeConfigParentModuleEnum {
  /** 数据简报 */
  DATA_BRIEFS = 1,
  /** 转化漏斗 */
  CONVERSION_FUNNEL = 2,
  /** 门店分布 */
  STORE_LOCATIONS = 3,
  /** 数据报表 */
  DATA_SHEET = 4,
  /** 门店状态 */
  STORE_STATUS = 5,
}

/**
 * 首页配置子模块ID枚举
 */
export enum HomeConfigChildrenModuleEnum {
  /** 新增机会点/累计机会点 */
  ADD_OPPORTUNITIES = 1,
  /** 新增拓店任务/累计拓店任务 */
  ADD_NEW_STORE_EXPANSION_TASKS = 2,
  /** 新增加盟商/累计加盟商 */
  ADD_NEW_FRANCHISEE = 3,
  /** 新增开业数/累计开业数 */
  ADD_NUMBER_OF_NEW_OPENINGS = 4,
  /** 机会点通过数 */
  NUMBER_OF_OPPORTUNITY_POINTS_PASSED = 5,
  /** 机会点通过率 */
  OPPORTUNITY_POINT_PASS_RATE = 6,
  /** 点位评估通过数 */
  POINT_EVALUATION_PASS_NUMBER = 7,
  /** 点位评估通过率 */
  POINT_ASSESSMENT_PASS_RATE = 8,
  /** 落位店铺数 */
  NUMBER_OF_STORES_LOCATED = 9,
  /** 平均落位周期 */
  AVERAGE_PLACEMENT_PERIOD = 10,
  /** 个人绩效报表 */
  PERSONAL_PERFORMANCE_REPORT = 23,
  /** 开发部绩效报表 */
  DEVELOPMENT_DEPARTMENT_REPORT = 24,
}

// 地图级别
export enum mapLevel{
  country = 1,
  province
}

