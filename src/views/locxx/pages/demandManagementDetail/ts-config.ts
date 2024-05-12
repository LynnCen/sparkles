export interface MockDemo {
  a: Function;
}

// 列表展示的 tag 的背景色
export const tagsColorMap = ['blue', 'orange', 'green', 'cyan'];

// 需求状态颜色
export const StatusColor = {
  1: '#959BAB', // 未开放
  2: '#009963', // 开放中
  3: '#959BAB', // 已关闭
  default: '#959BAB', // 已关闭
};

// 需求状态
export const DemandStatus = {
  ALL: '1', // 全部
  WAIT: '2', // 待审核
  PASS: '3', // 已审核
  WAIT_OUT_CALL: '4', // 待外呼
  WAIT_FOLLOW_UP: '5', // 待跟进
  HAS_DEMAND: '6', // 有需求
  NOT_DEMAND: '7', // 无需求
  default: '1', // 已关闭
};

// 需求状态
export const DemandStatusName = {
  '全部': '1', // 未开放
  '待审核': '2', // 待审核
  '已审核': '3', // 已审核
  '待外呼': '4', // 待外呼
  '待跟进': '5', // 待跟进
  '有需求': '6', // 有需求
  '无需求': '7', // 无需求
};

