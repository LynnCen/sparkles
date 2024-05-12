export class ControlType {
  /** 单选框 */
  static SINGLE_RADIO = { value: 1, name: '单选框', csName: 'cs_single_radio' };
  /** 多选框 */
  static CHECK_BOX = { value: 2, name: '多选框', csName: 'cs_check_box' };
  /** 单行输入框 */
  static INPUT = { value: 3, name: '单行输入框', csName: 'cs_input' };
  /** 多行文本框 */
  static TEXT_AREA = { value: 4, name: '多行文本框', csName: 'cs_text_area' };
  /** 文件上传 */
  static UPLOAD = { value: 5, name: '文件上传', csName: 'cs_upload' };
  /** 多类型分布 */
  static RATIO = { value: 6, name: '多类型分布', csName: 'cs_ratio' };
  /** 数字输入框 */
  static INPUT_NUMBER = { value: 7, name: '数字输入框', csName: 'cs_input_number' };
  /** 地理围栏 */
  static MAP_POLYGON = { value: 8, name: '地理围栏', csName: 'cs_map_polygon' };
  /** 时间 */
  static TIME = { value: 9, name: '时间', csName: 'cs_time' };
  /** 详细地址 */
  static ADDRESS = { value: 10, name: '详细地址', csName: 'cs_address' };
  /** 楼层信息 */
  static FLOOR_INFO = { value: 11, name: '楼层信息', csName: 'cs_floor' };
  /** 通道描述 */
  static CHANNEL_DESC = { value: 12, name: '通道描述', csName: 'cs_channel' };
  /** 楼层描述 */
  static FLOOR_DESC = { value: 13, name: '楼层描述', csName: 'cs_floor_desc' };
  /** 省市区 */
  static AREA = { value: 14, name: '省市区', csName: 'cs_area' };
  /** 当前报价 */
  static CURRENT_PRICE = { value: 15, name: '当前报价', csName: 'cs_current_price' };
  /** 历史报价 */
  static HISTORY_PRICE = { value: 16, name: '历史报价', csName: 'cs_history_price' };
  /** 规格（长宽） */
  static SPEC_L_W = { value: 17, name: '规格（长宽）', csName: 'cs_spec_l_w' };
  /** 商圈 */
  static BUSINESS_CIRCLE = { value: 18, name: '商圈', csName: 'cs_business_circle' };
  /** 场地类型 */
  static RES_TYPE_PLACE = { value: 19, name: '场地类型', csName: 'cs_res_type_place' };
  /** 点位类型 */
  static RES_TYPE_SPOT = { value: 20, name: '点位类型', csName: 'cs_res_type_spot' };
  /** 树形选择 */
  static TREE_SELECT = { value: 21, name: '树形选择', csName: 'cs_tree_select' };
  /** 落位区域 */
  static SPOT_POSITION = { value: 22, name: '落位区域', csName: 'cs_spot_position' };
  /** 富文本 */
  static RICH_TEXT = { value: 23, name: '富文本', csName: 'cs_rich_text' };
  /** 计算属性 */
  static COMPUTER = { value: 24, name: '计算属性', csName: 'cs_computer' };
  /** 周边品牌查询 */
  static SURROUND_SEARCH = { value: 25, name: '周边品牌查询', csName: 'cs_surround_search' };
  /** 踩点类型 */
  static FOOTPRINT = { value: 26, name: '踩点类型', csName: 'cs_footprint' };
  /** 子表单 */
  static SUB_FORM = { value: 27, name: '子表单', csName: 'cs_sub_form' };
  /** 网规组件 */
  static NETWORK_COMPONENT = { value: 28, name: '网规组件', csName: 'cs_network_component' };
  /** 销售额预测 */
  static SALE_AMOUNT = { value: 29, name: '销售额预测', csName: 'cs_sale_amount' };
  /** 匹配商圈 */
  static MATCH_BUSINESS_CIRCLE = { value: 30, name: '匹配商圈', csName: 'cs_match_business_circle' };
  /** 日均客流预测 */
  static DAILY_FLOW_PREDICT = { value: 31, name: '日均客流预测', csName: 'cs_daily_flow_predict' };
  /** 参照转化率 */
  static REFERENCE_CONVERSION = { value: 32, name: '参照转化率', csName: 'cs_reference_conversion' };
  /** 参照租金 */
  static REFERENCE_RENT = { value: 33, name: '参照租金', csName: 'cs_reference_rent' };

  static getByValue(value) {
    return Object.values(ControlType).filter((item) => item.value === value)[0];
  }
}

export const OnlyLocation = [26, 28]; // 只有 location 才有的控件;
/** 子表单支持的组件类型 */
export const SUB_FORM_SUPPORT_CONTROL_TYPE = [
  ControlType.SINGLE_RADIO.value,
  ControlType.CHECK_BOX.value,
  ControlType.INPUT.value,
  ControlType.TEXT_AREA.value,
  ControlType.INPUT_NUMBER.value,
  ControlType.TIME.value,
  ControlType.AREA.value,
  ControlType.TREE_SELECT.value
];

