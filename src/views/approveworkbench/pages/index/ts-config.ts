/**
 * @Description
 */
/** table内数据请求参数 */
export interface FiftersType {
	tab: number; // 顶部tab
	isRead?: number; // 消息tab是否已读
	keyword?: string; // 搜索关键词
}

/** 工作台消息tab数量 */
export interface TabCountType {
	itoDoCount: number; // 待处理
	ihaveDoneCount: number; // 已处理的
	isponsorCount: number; // 我发起的
	msgCount: number; // 消息数量
	permissions?: PermissionsType[];
}
/** 权限配置 */
export interface PermissionsType {
	event: string;
	name: string;
};

/** 审批工作台权限配置 */
export enum YN_PROMISSION_ENUMS {
	/** 鱼你创建审批 */
	YN_APPROVAL_CREATE = 'ynApproval:create',
	/** 鱼你点位评估审批创建*/
	YN_APPROVAL_EVALUATION_CREATE = 'ynApprovalEvaluation:create',
	/* 鱼你合同审批创建*/
	YN_APPROVAL_CONTRACT_CREATE = 'ynApprovalContract:create',
	/** 鱼你提前设计审批创建*/
	YN_APPROVAL_DESIGN_CREATE = 'ynApprovalDesign:create',
}

/** 审批工作台tab枚举值 */
export enum WORKBENCH_TABS_ENUMS {
	/** 待我处理 */
	WAITING_DISPOSE = '1',
	/** 我发起的*/
	MY_APPROVE = '2',
	/** 已处理 */
	HAS_SOLVED = '3',
	/** 审批消息 */
	APPROVE_MESSAGE = '4',
}

/** 审批状态枚举值 */
export enum APPROVE_STATUS_ENUMS {
	/** 待处理 */
	WAITING_DISPOSE = 0,
	/** 审核通过 */
	APPROVE_ACCESS = 1,
	/** 审核拒绝 */
	APPROVE_REFUSE = 2,
	/** 审核驳回 */
	APPROVE_REJECT = 4,
}

/** 审批类型枚举值 */
export enum APPROVE_TYPE_ENUMS {
	/** 开发异动 */
	DEVELOP_CHANGE = 1,
	/** 点位保护 */
	POINT_PROTECT = 2,
	/** 店铺测评 */
	STORE_TEST = 3,
}

/** 消息类型枚举值 */
export enum MSG_TYPE_ENUMS {
	/** 消息type-开发异动 */
	DEVELOP_CHANGE = 1,
	/** 消息type-点位保护 */
	POINT_PROTECT = 2,
	/** 消息type-点位评估申请 */
	POINT_ASSESS_APPROVE = 3,
	/** 消息type-点位保护申请 */
	POINT_PROTECT_APPROVE = 4,
}

/** 消息是否已读/未读 */
export enum MSG_STATUS_ENUMS {
	/** 已阅 */
	HAS_READ = 1,
	/** 待阅 */
	NOT_READ = 0,
}
