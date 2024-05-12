
export interface MockDemo {
  a: Function;
}



// 展示指标选项
export const showTypeOptions = [
  { value: 1, label: '地区' },
  { value: 2, label: '商圈' },
];


export enum showTypes{
  AREA = 1,
  BUSINESS = 2,
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
