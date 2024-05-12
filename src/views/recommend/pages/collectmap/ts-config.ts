export enum status {
  NOT_RELATION = 0, // 未关联的
  WILL_APPROVAL, // 待审批
  APPROVAL, // 审核中
  PASS, // 审核通过
  DENY, // 已驳回
  REJECT, // 不通过
}
export const StatusColor = {
  [status.PASS]: {
    text: '审核已通过',
    color: '#009963'
  },
  [status.APPROVAL]: {
    text: '审核中',
    color: '#FF861D'
  },
  [status.REJECT]: {
    text: '不通过',
    color: '#F23030'
  },
  [status.DENY]: {
    text: '已驳回',
    color: '#F23030'
  },
  [status.NOT_RELATION]: {
    text: '未录入',
    color: '#222'
  },
};
export enum tabsKeys {
  firstTabKey = 'firstTabKey',
  secondTabKey = 'secondTabKey',
  thirdTabKey = 'thirdTabKey'
}
export const LineColor = {
  [tabsKeys.firstTabKey]: {
    color: '#549BFF',
    hoverColor: '#006AFF'
  },
  [tabsKeys.secondTabKey]: {
    color: '#FFC28E',
    hoverColor: '#FF861D'
  },
  [tabsKeys.thirdTabKey]: {
    color: '#7FCCB1',
    hoverColor: '#009963'
  },
};

