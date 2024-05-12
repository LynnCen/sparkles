/**
 * @Description 机会点详情类型字段
 */

import { ChanceDetailModule } from '@/common/components/business/ExpandStore/ts-config';

/** 机会点详情数据类型 */
export interface ChangePonitDetailType {
	/** 机会点id */
	id: number;
	/** 模版映射id */
	dynamicRelationId: number;
	// 商圈id
	modelClusterId?: number;
	/** 机会点名称 */
	name: string;
	/** 详细地址 */
	address: string;
	/** 省份id*/
	provinceId: number;
	/** 城市id*/
	cityId: number;
	/** 区id*/
	districtId: number;
	/** 经纬度*/
	lng: string;
	/** 经纬度*/
	lat: string;
  /** 模块详情 */
  moduleDetails:ModuleDetailsType[];
  /** 权限列表 */
  permissions: PermissionsType[];
  /** 审批详情 */
  approvalInfos: ApprovalInfosType[];
  /** 是否支持直接提交审批 1:支持 2:不支持 */
  supportDirectApproval: number;
}

/** 机会点详情-审批信息类型 */
export interface ApprovalInfosType{
	/** 审批id */
	approvalId: number
	/** 审批类型 1-机会点审批 */
	approvalType: number
	/** 审批类型名称 */
	approvalTypeName: string
  /** 评估类型（1点位评估）	*/
  approvalTypeValue	:number
  /** 评估类型名称 */
  approvalTypeValueName:	string
  /** 审批状态*/
  approvalStatus	:number
  /** 审批状态名称*/
  approvalStatusName	:string
}

/** 权限参数类型 */
export interface PermissionsType {
  event: string;
  name: string
}

/** 模块详情信息类型 */
export interface ModuleDetailsType {
	/** 机会点id */
	id: number;
	/** 模块类型 */
	moduleType: ChanceDetailModule;
	/** 模版类型名称 */
	moduleTypeName: string;
	/** 核心模块数据 */
	importModule?: DynamicComponentType[];
	/** 亚瑟士定制模块 */
	asicsEstimateModule?: AsicsEstimateModuleType;
	/** 踩点模块 */
	checkSpotModule?: CheckSpotModuleType;
	/** 评分模块 */
	radarModule?: RadarModuleType;
	/** 收益预估模块（同核心模块） */
	earnEstimateModule?: DynamicComponentType;
	/** 基本信息模块 */
	infoModule?: InfoModuleType;
	/** 拓店任务信息模块 */
	standardTaskModule?: any;
	/** 选址地图拓店任务信息模块 */
	standardDirectTaskModule?: any;
	/** 排序字段 */
	sort: number;
}

/** 亚瑟士定制模块类型 */
export interface AsicsEstimateModuleType {
	/** 客流匹配指数 */
	flowMatchIndex: number;
  /** 客流指数说明 */
  flowMatchExplanation: string;
	/** 预估销售额 */
	sales: number;
	/** 年坪效 */
	yearAreaSales: number;
}

/** 踩点信息表格项类型 */
export interface CheckSpotArrayType {
	/** 交付报告 */
	deliveryReportUrl: string;
	/** 人数 */
	flowCount: number;
	/** 踩点日期 */
	checkDate: string;
}

/** 踩点信息模块类型 */
export interface CheckSpotModuleType {
	/** 踩点信息表格数据 */
	checkSpotDetails: CheckSpotArrayType[];
}

/** 雷达图每项类型 */
export interface ScoreType {
	/** 雷达图指标名称 (一级/二级)*/
	name: string;
	/** 得分 */
	score: number;
	/** 权重 */
	weight: number;
	/** 权重值 */
	weightScore: number;
	/** 二级指标项 */
	scoreItems: ScoreType[];
}

/** 雷达图所需要数据 */
export interface RadarModuleType {
	/** 总分 */
	shopScore: number;
	/** 雷达图项 */
	scoreGroups: ScoreType[];
}

/** 雷达图参考项 */
export interface IndicatorType {
	/** 指标项名称 */
	name: string;
	/** 最大值 */
	max: number;
}

/** 动态表单数据类型 */
export interface DynamicComponentType {
	/** id */
	id: number;
	/** 类目ID */
	categoryId: number;
	/**  类目模版ID*/
	categoryTemplateId: number;
	/**  属性分组ID*/
	categoryPropertyGroupId: number;
	/**  属性ID*/
	propertyId: number;
	/**  属性类别ID*/
	propertyClassificationId: number;
	/**  名称*/
	name: string;
	/**  别名*/
	anotherName: string;
	/**  控件类型（单选框、多选框、单行文本、多行文本、占比、时间、文件上传、预设控件）*/
	controlType: number;
	/**  标识*/
	identification: string;
	/**  时间类型（时间点（年月日），时间段（年月日），时间点（时分秒），时间段（时分秒））*/
	timeType: string;
	/**  必填校验*/
	required: number;
	/**  去重校验*/
	duplicate: number;
	/**  叠加校验*/
	superposition: number;
	/**  置顶*/
	onTop: number;
	/** 置顶排序 */
	topSortNum: number;
	/**  是否展示给客户*/
	h5CustomerDisplay: number;
	/** 排序数 */
	sortNum: number;
	/**  约束条件*/
	restriction: string;
	/**  模版自定义约束条件(和从属性继承的约束条件做区分)*/
	templateRestriction: string;
	/**  备注*/
	remark: string;
	/** 属性配置项*/
	propertyConfigOptionVOList: PropertyConfigOptionVOListType[];
	/** 被动联动属性 */
	emplateRestrictionPassiveList: templateRestrictionPassiveListType[];
	/** 是否可修改 */
	isFixed: number;
	/** 表单填入的值 */
	textValue: string;
}

/** 属性配置项类型*/
export interface PropertyConfigOptionVOListType {
	/** id */
	id: number;
	/** 类目ID */
	categoryId: number;
	/**  类目模版ID*/
	categoryTemplateId: number;
	/**  属性分组ID*/
	categoryPropertyGroupId: number;
	/** 名称 */
	name: string;
	/** 提示*/
	tips: string;
	/** 排序数*/
	sortNum: number;
	/** 备注*/
	remark: string;
}

/** 被动联动属性类型 */
export interface templateRestrictionPassiveListType {
	/** 填充的propertyId */
	relationsComponent: number;
	/** 选中的值 */
	currentValue: number[];
}

/** 基本信息模块类型 */
export interface InfoModuleType {
	/** 模版映射id */
	dynamicRelationId: number;
	/** 点位类型*/
	type: number;
	/** 店铺类型*/
	shopCategory: number;
	/** 类目模版ID*/
	id: number;
	/** 名称*/
	name: string;
	/** 使用类型（0自用，1渠道）*/
	useType: number;
	/** 资源类型（0场地，1点位，2供给）*/
	resourcesType: number;
	/** 备注 */
	remark: string;
	/** 排序字段*/
	sort: number;
	/** 子级 */
	childList: object[];
	/** 分组标签集（每一项就是属性配置）*/
	propertyGroupVOList: propertyGroupVOListType[];
}

/** 属性组类型 */
export interface propertyGroupVOListType {
	/** 标签组ID */
	id: number;
	/**  类目ID*/
	categoryId: number;
	/** 父级 */
	parentId: number;
	/** 名称 */
	name: string;
	/** 排序 */
	sortNum: number;
	/**  类目模版ID*/
	categoryTemplateId: number;
	/** 子级 */
	childList: propertyGroupVOListType[];
	/** 分组标签集（每一项就是属性配置） */
	propertyConfigVOList: DynamicComponentType[];
}
