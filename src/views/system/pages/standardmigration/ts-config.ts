export interface MockDemo {
  a: Function;
}

/** 迁移任务列表 -任务类型枚举
 * 后端定义文档：https://yapi.lanhanba.com/project/532/interface/api/62495
*/
export enum TaskType_Enums {
  /** 创建的拓店任务 -->跳转拓店任务详情 */
  TASK_CREATOR= 1,

  /** 被指派的拓店任务  -->跳转拓店任务详情 */
  TASK_ASSIGN= 2,

  /** 机会点 --> 跳转机会点详情 */
  CHANCE_POINT= 3,

  /** 开发异动申请  --> 详情跳转审批 */
  TASK_CHANGE= 4,

  /** 店铺评估申请 --> 详情跳转审批 */
  SHOP_EVALUATION= 5,

  /** 审批 --> 详情跳转审批 */
  APPROVAL= 6,

  /** 集客点 --> 详情跳转审批 */
  PLAN_SPOT= 7,
}
export enum ApprovalType_Enums{
  NetworkPlan = 15,
  AddNetWork = 17, // 添加网规审批
}
