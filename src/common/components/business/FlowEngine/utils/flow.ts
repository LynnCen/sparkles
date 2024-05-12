/**
 * @Description
 */
// 添加节点类型
export const OptionTypes = {
  START: 0,
  /**
   * 普通节点
   */
  APPROVER: 1,
  /**
   * 条件节点
   */
  BRANCH: 2,
  /**
   *  条件分支
   */
  CONDITION: 3,
};
export const NodeTypes = { ...OptionTypes, START: 0 };
// 节点类型默认标题名
export const OptionNames = {
  [OptionTypes.APPROVER]: '审批节点',
  [OptionTypes.CONDITION]: '条件分支',
};
// 节点模板
export const NodeTemplates = {
  [OptionTypes.APPROVER]: {
    name: '审批节点',
    desc: '',
    type: OptionTypes.APPROVER,
    nodeCode: '',
    prevNode: [],
    nextNode: [],
    roleIds: [],
    positionIds: [],
    employeeIds: [],
    buttons: [
      {
        code: 'approve',
        name: '通过',
        alias: '通过',
        enable: 1,
      },
      {
        code: 'reject',
        name: '拒绝',
        alias: '拒绝',
        enable: 1,
      },
      {
        code: 'transfer',
        name: '转交',
        alias: '转交',
        enable: 1,
      },
      {
        code: 'rebut',
        name: '驳回',
        alias: '驳回',
        enable: 0, // 驳回默认不勾选，不展示驳回设置
      },
    ],
    callbackParams: {
      approve: null,
      reject: null,
      transfer: null,
      rebut: null,
    },
    approverType: 1,
    approveType: 1,
    sponsorMangerLevel: 1,
    autoApprove: 1,
    superiorApprove: false,
    ccType: 1,
    ccRoleIds: [],
    ccPositionIds: [],
    ccEmployeeIds: [],
    childNode: null,
    rejectNode: null,
  },
  [OptionTypes.CONDITION]: {
    name: '条件分支',
    type: OptionTypes.CONDITION,
    childNode: null,
    conditionNodes: [],
  },
  [OptionTypes.BRANCH]: {
    name: '条件',
    desc: '',
    type: OptionTypes.BRANCH,
    nodeCode: '',
    childNode: null,
    prevNode: [],
    nextNode: [],
    conditions: [],
    sysConditions: {}, // 系统条件
    fields: [], // 字段
  },
};
