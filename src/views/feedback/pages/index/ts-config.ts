export interface MockDemo {
  a: Function;
}

// 反馈状态颜色
export const StatusColor = {
  1: '#FF861D', // 待解决
  2: '#999999', // 已解决
  3: '#F23030', // 已拒绝
  default: '#FF861D', // 待解决
};

// 问题反馈tab
export const FeedbackTabs = {
  BUSINESS_COMPLAIN: 'problemFeedback:businessComplaint', // 业务投诉
  CORRECT_RESOURCE_ERROR: 'problemFeedback:resourceErrorCorrection', // 资源纠错
};

// 问题反馈tab
export const FeedbackType = {
  BUSINESS_COMPLAIN: 1, // 业务投诉
  CORRECT_RESOURCE_ERROR: 2, // 资源纠错
};

// 处理状态
export enum HandleResult{
  pending = 0,
  accept = 1,
  refuse = 2
}
