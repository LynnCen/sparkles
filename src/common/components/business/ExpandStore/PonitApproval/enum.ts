/**
 * @Description
 */

/** 机会点详情 - 审批类型枚举 */
export enum CHANCEPOINT_APPROVE_TYPE_ENUMS {
  /** 点位评估*/
  POINT_EVALUATE = '1'
}

/** 机会点详情-审批状态枚举 */
export enum CHANCEPOINT_APPROVE_STATUS_ENUMS {
  /** 审批中*/
  INIT = '0',
  /** 审批通过 */
  PASS = '1',
  /** 审批拒绝 */
  DENY ='2',
}

// 审批状态对应的提示颜色Map  维护
export const StatusMap = new Map([
  [CHANCEPOINT_APPROVE_STATUS_ENUMS.INIT, { backgroundColor: '#FF861D' }],
  [CHANCEPOINT_APPROVE_STATUS_ENUMS.PASS, { backgroundColor: '#009963' }],
  [CHANCEPOINT_APPROVE_STATUS_ENUMS.DENY, { backgroundColor: '#F53F3F' }],
]);
