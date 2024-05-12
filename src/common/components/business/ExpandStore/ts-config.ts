// 审批状态
export enum ApprovalStatus {
  Untreated = 0, // 未处理
  Passed, // 已通过
  Denied, // 已拒绝
  Revoke, // 审核撤销
  Reject, // 已驳回
}

// 审批节点状态（中台维护的）
export enum ApprovalNodeStatus {
  Process = 1, // 处理中
  Approved, // 审核通过
  Denied, // 审核拒绝
  Reject, // 审核驳回
}

// 审批节点审批人状态（中台维护的）
export enum ApprovalNodeOperatorStatus {
  Process = 1, // 处理中
  Approved, // 审核通过
  Denied, // 审核拒绝
  Transfer, // 转交
  Reject, // 审核驳回
}

/**
 * @Description 审批详情权限
 */
export enum ApprovePermission {
  Transfer = 'transfer', // 转交
  Withdraw = 'withdraw', // 撤回
  Reject = 'reject', // 拒绝
  Rebut = 'rebut', // 驳回
  Edit = 'edit', // 编辑
  Approve = 'approve', // 通过
  Reboot = 'reboot', // 重新提交
}

/**
 * @Description 审批详情特殊页面No
 */
export enum ApprovePageNo {
  KFGSTZ001 = 'KFGSTZ001', // 跨公司调整页面1
  KFGSTZ002 = 'KFGSTZ002', // 跨公司调整页面2
  KFGSTZ003 = 'KFGSTZ003', // 跨公司调整页面3
  GHZRR001 = 'GHZRR001', // 更换责任人
}

// 审批类型
export enum ApprovalType {
  ChancePoint = 1, // 机会点
  TaskChange = 2, // 拓店任务异动
  ShopEvaluation = 3, // 点位评估
  DesignAdvance = 4, // 提前设计
  ShopProtect = 5, // 门店保护
  Contract = 6, // 合同审批

  PlanSpot = 8, // 集客点
}

// 审批类型
export enum ApprovalTypeValue {
  /**
   * 机会点审批
   */
  ChancePointEvaluate = 1, // 机会点审批
  /**
   * 开发异动
   */
  SelectToEvaluation = 2, // 选址转测评
  EvaluationToSelect = 3, // 测评转选址
  TerminateTask = 4, // 终止任务
  TransferTask = 5, // 变更责任人
  ChangeOffice = 6, // 跨分公司调整
  Other = 7, // 其他
  /**
   * 店铺评估
   */
  ShopEvaluation = 8, // 店铺评估
  /**
   * 设计申请
   */
  DesignAdvance = 9, // 设计申请
  /*
   * 门店报告
   */
  ShopProtect = 10, // 门店保护
  /*
   * 合同审批
   */
  Contract = 11, // 合同审批
  StoreHouseDelivery = 12, // 门店交房
  StoreOpen = 13, // 盛大开业
  StoreClose = 14, // 闭店

  /**
   * 规划申请
   */
  PlanDelivery = 15, // 网规
  /**
   * 集客点
   */
  PlanSpot = 16, // 集客点
  /**
   *  添加网规申请
   */
  AddNetWork// 添加网规申请17
}

/**
 * @Description 机会点详情模块定义
 */
export enum ChanceDetailModule {
  Basic = 1, // 核心信息
  Radar = 2, // 雷达图
  Benifit = 3, // 收益预估
  Detail = 4, // 详情
  Footprint = 5, // 踩点组件
  Asics = 6, // 亚瑟士定制
  Task = 7, // 拓店任务信息
  Overview = 8, // 项目综述
  BusinessAreaModule = 9, // 商圈信息
}

/**
 * @Description 机会点状态定义
 */
export enum ChanceStatus {
  Draft = 0, // 草稿
  WaitApprove = 100, // 代审批（待匹配）
  Approving = 200, // 审批中
  Pass = 300, // 通过
  Reject = 400, // 未通过
  WaitReport = 500, // 待提报
  Estimating = 600, // 评估中
  Estimated = 700, // 评估通过
  EstimateFail = 800, // 评估未通过
  Signing = 900, // 签约中
  Complete = 1000, // 已落位
  Close = 1100, // 已关闭
}

/** 机会点状态颜色值 */
export const ChancePointStatusColor = {
  [ChanceStatus.WaitApprove]: '#222222',
  [ChanceStatus.Approving]: '#FF861D',
  [ChanceStatus.Pass]: '#009963',
  [ChanceStatus.Reject]: '#F53F3F',
  [ChanceStatus.WaitReport]: '#222222',
  [ChanceStatus.Estimating]: '#FF861D',
  [ChanceStatus.Estimated]: '#009963',
  [ChanceStatus.EstimateFail]: '#F53F3F',
  [ChanceStatus.Signing]: '#FF861D',
  [ChanceStatus.Complete]: '#009963',
  [ChanceStatus.Close]: '#999999',
};

// 审批类型
export enum StoreStatus {
  Signed = 100, // 已签约
  HouseDeliverApproving = 200, // 交房审批中
  HouseDelivered = 300, // 已交房
  OpenApproving = 400, // 开业审批中
  Opened = 500, // 开业中
  CLoseApproving = 600, // 闭店审批中,
  Closed = 700, // 已闭店
}

/**
 * @Description 机会点详情权限
 */
export enum ChanceDetailPermission {
  Edit = 'edit', // 编辑机会点
  SubmitApprove = 'submitApproval', // 提交审批
  Revoke = 'revokeApproval', // 撤销审批
}

/**
 * @Description 功能开关-机会点详情是否支持编辑机会点
 */
export const IS_DETAIL_EDIT_CHANCE = true;

// 任务状态 status(1:进行中 2:已完成 3:已变更 4:已关闭)
export enum TaskStatus {
  WaitAssign = 10, // 待指派
  Processing = 20, // 进行中
  Changed = 30, // 已变更
  Complete = 40, // 已完成
  Closed = 50, // 已关闭
}

/** 任务状态颜色值 */
export const TaskStatusColor = {
  [TaskStatus.Complete]: '#009963',
  [TaskStatus.Changed]: '#F53F3F',
  [TaskStatus.Closed]: '#999999',
  [TaskStatus.Processing]: '#FF8400',
};

// 任务异动状态  0：否  1：审核中  2：审核通过
export enum TaskChange {
  None = 0, // 否
  Approving = 1, // 审核中
  Passed = 2, // 审核通过
}

// 拓店任务tab key（与接口约定的拓店任务列表tab字段值）
export enum TaskTab {
  AssignMe = '1', // 指派我的
  Created = '2', // 我创建的
  WaitAssign ='3'
}

