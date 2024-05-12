/**
 * @Description
 */
/** table内数据请求参数 */
export interface FiftersType {
	tab: number; // 顶部tab
	isRead?: number; // 消息tab是否已读
	keyword?: string; // 搜索关键词
  typeValueIdList?: number[];
  statusIdList?: number[];
}

/** 工作台消息tab数量 */
export interface TabCountType {
	itoDoCount: number; // 待处理
	ihaveDoneCount: number; // 已处理的
	isponsorCount: number; // 我发起的
	msgCount: number; // 消息数量
  iccCount:number;// 抄送我的
  ccUnreadCount:number;// 抄送未读个数
	permissions?: PermissionsType[];
}
/** 权限配置 */
export interface PermissionsType {
	event: string;
	name: string;
};

/** 审批工作台tab枚举值 */
export enum WORKBENCH_TABS_ENUMS {
	/** 待我处理 */
	WAITING_DISPOSE = '1',
	/** 我发起的*/
	MY_APPROVE = '2',
	/** 已处理 */
	HAS_SOLVED = '3',
  /** 抄送我的 */
	COPY = '4',
}

/** 审批状态枚举值 */
export enum APPROVE_STATUS_ENUMS {
	/** 待处理 */
	WAITING_DISPOSE = 0,
	/** 审核通过 */
	APPROVE_ACCESS = 1,
	/** 审核拒绝 */
	APPROVE_REFUSE = 2,
	/** 审核撤销 */
	APPROVE_REVOCATION = 3,
	/** 审核驳回 */
	APPROVE_REJECT = 4,
}

// 任务异动状态  0：否  1：审核中  2：审核通过
export enum TaskChange {
  None = 0, // 否
  Approving = 1, // 审核中
  Passed = 2, // 审核通过
}


// /** 审批工作台权限配置 */
// export enum APPROVE_BUTTON_TYPE {
//   // 审批者角度
//   /** 加签*/
// 	ADD_APPROVE = 'addApproval',
//   /** 转交*/
// 	TRANSFER = 'transfer',
// 	/** 通过 */
// 	PASS = 'pass',
// 	/** 不通过*/
// 	NO_PASS = 'reject',

//   // 发起人角度

// 	/* 撤回*/
// 	REVOKE = 'revoke',
// 	/** 提交审批*/
// 	SUBMIT = 'submit',
// }

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
  [TaskStatus.WaitAssign]: {
    background: 'rgba(146,165,202,0.07)',
    color: '#222222',
  },
  [TaskStatus.Processing]: {
    background: 'rgba(255, 134, 29, 0.06)',
    color: '#FF861D'
  },
  [TaskStatus.Changed]: {
    background: 'rgba(245, 63, 63, 0.08)',
    color: '#F53F3F',
  },
  [TaskStatus.Complete]: {
    background: 'rgba(0, 153, 99, 0.06)',
    color: '#009963',
  },
  [TaskStatus.Closed]: {
    background: 'rgba(146, 165, 202, 0.07)',
    color: '#7886A1',
  },
};
