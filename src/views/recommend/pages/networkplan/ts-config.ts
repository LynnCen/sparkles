export interface MockDemo {
  a: Function;
}

/** 规划管理 tab 枚举 */
export enum TabsEnums {
  /**
   * 总公司
   */
  HEAD_OFFICE = '1',
  /**
   * 分公司
   */
  BRANCH = '2',
}

/** 规划状态 */
export const enum PlanStatusEnum {
  /**
   * 总部规划中
   */
  HEADQUARTERS_IN_PLANNING = 1,
  /**
   * 分公司规划中
   */
  BRANCH_IS_PLANNING = 2,
  /**
   * 审批中
   */
  UNDER_APPROVAL = 3,
  /**
   * 已通过
   */
  PASSED = 4,
  /**
  * 已驳回
  */
  DISMISSED = 5,
  /**
   * 已拒绝
   */
  REJECTED = 6,
  /**
   * 生效中
   */
  ACTIVE = 7,
}

/** 规划状态 颜色枚举*/
export const PlanningStatus = {
  1: {
    color: '#FA8723',
    text: '总部规划中'
  }, // 总部规划中
  2: {
    color: '#F216EB',
    text: '分公司规划中'
  }, // 分公司规划中
  3: {
    color: '#006AFF',
    text: '审批中'
  }, // 审批中
  4: {
    color: '#009963',
    text: '已通过'
  }, // 已通过
  5: {
    color: '#F23030',
    text: '已驳回'
  }, // 已驳回
  6: {
    color: '#F23030',
    text: '已拒绝'
  }, // 已拒绝
  7: {
    color: '#F5D83F',
    text: '生效中'
  }, // 生效中
};
