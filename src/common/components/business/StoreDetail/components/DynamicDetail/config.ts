// 动态表单使用的公共函数
import { isArray, isNotEmpty } from '@lhb/func';
import { isNotEmptyAny, contrast } from '@lhb/func';

// 控件类型
export const ControlType = {
  SINGLE_RADIO: { value: 1, name: '单选框', csName: 'cs_single_radio' },
  CHECK_BOX: { value: 2, name: '多选框', csName: 'cs_check_box' },
  INPUT: { value: 3, name: '输入框', csName: 'cs_input' },
  TEXT_AREA: { value: 4, name: '文本框', csName: 'cs_text_area' },
  UPLOAD: { value: 5, name: '文件上传', csName: 'cs_upload' },
  // RATIO: { value: 6, name: '占比', csName: 'cs_ratio' },
  INPUT_NUMBER: { value: 7, name: '数字输入框', csName: 'cs_input_number' },
  // MAP_POLYGON: { value: 8, name: '地理围栏', csName: 'cs_map_polygon' },
  // TIME: { value: 9, name: '时间', csName: 'cs_time' },
  ADDRESS: { value: 10, name: '详细地址', csName: 'cs_address' },
  // FLOOR_INFO: { value: 11, name: '楼层信息', csName: 'cs_floor' },
  // CHANNEL_DESC: { value: 12, name: '通道描述', csName: 'cs_channel' },
  // FLOOR_DESC: { value: 13, name: '楼层描述', csName: 'cs_floor_desc' },
  AREA: { value: 14, name: '省市区', csName: 'cs_area' },
  // CURRENT_PRICE: { value: 15, name: '当前报价', csName: 'cs_current_price' },
  // HISTORY_PRICE: { value: 16, name: '历史报价', csName: 'cs_history_price' },
  // SPEC_L_W: { value: 17, name: '规格（长宽）', csName: 'cs_spec_l_w' },
  // BUSINESS_CIRCLE: { value: 18, name: '商圈', csName: 'cs_business_circle' },
  // RES_TYPE_PLACE: { value: 19, name: '场地类型', csName: 'cs_res_type_place' },
  // RES_TYPE_SPOT: { value: 20, name: '点位类型', csName: 'cs_res_type_spot' },
  // TREE_SELECT: { value: 21, name: '树形选择', csName: 'cs_tree_select' },
  // SPOT_POSITION: { value: 22, name: '落位区域', csName: 'cs_spot_position' },
  SURROUND_SEARCH: { value: 25, name: '周边查询', csName: 'cs_surround_search' },
  FOOTPRINT: { value: 26, name: '踩点类型', csName: 'cs_footprint' },
  CONTEND_INFO: { value: 27, name: '竞品信息', csName: 'cs_contend_info' },
  BUSINESS_PLANNING: { value: 28, name: '网规组件', csName: 'cs_network_component' },
  SALE_AMOUNT: { value: 29, name: '销售额预测', csName: 'cs_sale_amount' },
  MATCH_BUSINESS_CIRCLE: { value: 30, name: '匹配商圈', csName: 'cs_match_business_circle' },
  DAILY_FLOW_PREDICT: { value: 31, name: '日均客流预测', csName: 'cs_daily_flow_predict' },
  REFERENCE_CONVERSION: { value: 32, name: '参照转化率', csName: '' },
  REFERENCE_RENT: { value: 33, name: '参照租金', csName: '' },
};

// 根据 value 获取对应的 ControlType
export const getByValue = (value: any) => {
  return Object.values(ControlType).find((item) => item.value === value);
};

export interface PropertyItem {
  id: number;
  propertyId: number;
  name: string;
  anotherName: string;
  textValue: any;
  [p: string]: any;
}

// 根据 controlType 获取 textValue 的初始值
export const getTextValueInitValue = (controlType: number) => {
  let textValue:any = null;
  // 为空时，赋予默认值
  switch (controlType) {
    case ControlType.SINGLE_RADIO.value:
      textValue = null;
      break;
    case ControlType.CHECK_BOX.value:
      textValue = [];
      break;
    case ControlType.INPUT.value:
    case ControlType.TEXT_AREA.value:
      textValue = null;
      break;
    case ControlType.UPLOAD.value:
      textValue = [];
      break;
    case ControlType.INPUT_NUMBER.value:
    case ControlType.ADDRESS.value:
    case ControlType.AREA.value:
      textValue = null;
      break;
    default:
      break;
  }
  return textValue;
};

// textValue 从 string 解析
export const decodeTextValue = (controlType: any, textValue: any) => {
  // 根据字段类型，将字符串的 textValue 进行解析
  if (isNotEmpty(textValue)) {
    // 需不需要加 try？
    try {
      switch (controlType) {
        case ControlType.SINGLE_RADIO.value: {
          const temp = JSON.parse(textValue);
          textValue = { 'id': temp.selectedId, 'name': temp.name, 'input': temp?.input };
          break;
        }
        case ControlType.CHECK_BOX.value: {
          const temp = JSON.parse(textValue);
          textValue = Array.isArray(temp) ? temp.map(item => ({ 'id': item.selectedId, 'name': item.name, 'input': item?.input })) : [];
          break;
        }
        case ControlType.UPLOAD.value:
          textValue = JSON.parse(textValue);
          break;
        case ControlType.INPUT_NUMBER.value: {
          const temp = JSON.parse(textValue);
          // textValue = contrast(temp, 'value');
          textValue = {
            'value': contrast(temp, 'value'),
            'suffix': contrast(temp, 'suffix'),
          };
          break;
        }
        case ControlType.AREA.value: {
          const temp = JSON.parse(textValue);
          textValue = [];
          if (temp) {
            temp.provinceId && (textValue[0] = { 'id': temp.provinceId, 'name': temp.provinceName });
            temp.cityId && (textValue[1] = { 'id': temp.cityId, 'name': temp.cityName });
            temp.districtId && (textValue[2] = { 'id': temp.districtId, 'name': temp.districtName });
          }
          break;
        }
        case ControlType.ADDRESS.value: {
          const temp = JSON.parse(textValue);
          textValue = {
            'address': temp.address,
            'lng': temp.longitude,
            'lat': temp.latitude,
          };
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log('error textValue 解析出错了：', textValue);
    }
  } else {
    textValue = getTextValueInitValue(controlType);
  }

  return textValue;
};


/* 递归处理 propertyGroupVOList 为平铺的 json 对象（propertyId 为 key 的对象）
  'propertyConfigVOList': [
    { 'propertyId': 472, 'name': '关联显示的输入框', 'controlType': 2, 'isShow': true, 'textValue': '输入的内容' },
    { 'propertyId': 473, 'name': '测试单选关联', 'controlType': 2, 'isShow': true, 'textValue': 1891 },
  ]
  =>
  {
    472: { 'id': 14675, 'propertyId': 472, 'name': '关联显示的输入框', 'controlType': 2, 'isShow': true, 'textValue': '输入的内容' },
    473: { 'id': 14676, 'propertyId': 473, 'name': '测试单选关联', 'controlType': 2, 'isShow': true, 'textValue': 1891 }
  }
  */
export const dfsPropertyGroupVoList = (propertyGroupVOList: Array<PropertyItem>) => {
  if (!Array.isArray(propertyGroupVOList) || !propertyGroupVOList.length) {
    return null;
  }
  const values = {};
  const tempObj = propertyGroupVOList.reduce((result: any, item: any) => {
    if (item.propertyId) {
      result[item.propertyId] = {
        'id': item.id,
        'propertyId': item.propertyId,
        'name': item.name,
        'anotherName': item.anotherName,
        'controlType': item.controlType,
        'isShow': item.isShow,
        'textValue': item.textValue,
        'templateRestrictionPassiveList': item.templateRestrictionPassiveList,
        'templateRestriction': item.templateRestriction,
        'restriction': item.restriction
      };
    }

    if (Array.isArray(item.childList) && item.childList.length) {
      item.childList.forEach((child: any) => {
        Object.assign(result, dfsPropertyGroupVoList(child.propertyConfigVOList));
      });
    }
    return result;
  }, {});

  Object.assign(values, tempObj);
  return values;
};

// 根据 dfsPropertyGroupVoList 返回的 map 对象判断是否显示该组件
const getItemShow = (item: any, propertyItemMap: any) => {
  /* 'templateRestrictionPassiveList': [
    // 当 propertyId=471 的组件选中 1889 选项时，显示当前组件
    { 'relationsComponent': 471, 'currentValue': [1889] }
  ] */
  const { propertyId, templateRestrictionPassiveList: comovementRelations } = item;

  if (!Array.isArray(comovementRelations) || comovementRelations.length === 0) {
    return true;
  }

  for (const index in comovementRelations) {
    if (true) {
      const { relationsComponent, currentValue } = comovementRelations[index];
      // 当关联的组件或者组件值为空时，组件关联信息异常，不进行校验，直接显示
      if (!isNotEmpty(relationsComponent) || !isNotEmptyAny(currentValue)) {
        console.log('组件关联信息异常，需要调查下，这次让通过', propertyId);
        return true;
      }

      // 关联组件当前的值
      const relationPropertyItem = propertyItemMap[relationsComponent];

      let isMatch = false;
      // 判断是否和 currentValue 匹配
      if (Array.isArray(currentValue) && currentValue.length && isNotEmpty(relationPropertyItem) && relationPropertyItem.textValue) {
      /* relationTextValue 关联组件的值：
        1. 多选-数组，如 [1, 2]、[{ id: 1, name: 'xxx' }, { id: 2, name: 'xxx' }]；
        2. 单选-值，如 {id: 1, name: 'xxx'}
        */
        const relationTextValue = JSON.parse(relationPropertyItem.textValue);

        // 多选-数组
        if (Array.isArray(relationTextValue) && relationTextValue.length) {
        // 如果类型是多选，textValue 是对象数组，需要处理成 ids 数组
          const ids = relationTextValue.map((item: any) => item instanceof Object ? item.selectedId : item);
          isMatch = currentValue.some(val => ids.includes(val));
        } else { // 单选-值
          isMatch = currentValue.includes(relationTextValue instanceof Object ? relationTextValue.selectedId : relationTextValue);
        }
      }

      if (isMatch) {
        return true;
      }
    }

  }

  return false;
};

/* 所有属性的值对象 { propertyId: { textValue: 字段的值, id, propertyId, isShow: 是否显示该组件 } }，如
  {
    472: { 'id': 14675, 'propertyId': 472, 'name': '关联显示的输入框', 'textValue': '输入的内容', isShow: true },
    473: { 'id': 14676, 'propertyId': 473, 'name': '测试单选关联', 'textValue': 1891, isShow: true }
  }
  保存和检查字段关联显示时使用
  */
export const getPropertyItemMap = (propertyGroupVOList: Array<any>) => {
  // 获取所有属性的 propertyId Map
  const propertyItemMap: any = dfsPropertyGroupVoList(propertyGroupVOList);

  if (propertyItemMap && propertyItemMap instanceof Object) {
    // 遍历所有属性，赋予 isShow 字段
    for (const key in propertyItemMap) {
      if (true) {
        const item = propertyItemMap[key];
        item.isShow = getItemShow(item, propertyItemMap);
      }
    }
  }

  return propertyItemMap;
};

/**
 *
 * @param {Object} config 对应templateRestriction
 * @param {Number | String | null} value 值
 * @returns boolean 是否标红
 */
export const checkNumberInputIsRed = (config: any, value: number | string | null) => {
  const { redMark } = config || {};
  if (!redMark) return false;
  const {
    firstComapre,
    firstValue,
    isItemTip,
    isRedMark,
    itemTip,
    joinType,
    secondComapre,
    secondValue,
    // isPageTip
  } = redMark;
  // if (!joinType) return false; // 值为 '&&'或者'||'
  let expressionStr = '';
  if (firstComapre && firstValue) { // 满足的第一个条件
    expressionStr += `(${value}${firstComapre === '=' ? '==' : firstComapre}${firstValue})`;
  }
  if (secondComapre && secondValue) { // 满足的第二个条件
    // 如果第一个条件 ？(拼接上joinType + 第二个条件) : 第二个条件
    expressionStr += `${expressionStr ? `${firstComapre && firstValue && joinType ? joinType : ''}(${value}${secondComapre === '=' ? '==' : secondComapre}${secondValue})` : `${value}${secondComapre}${secondValue}`}`;
  }
  // eslint-disable-next-line no-eval
  if (eval(expressionStr)) return isRedMark && isItemTip && !!itemTip;
  return false;
};

/**
 *
 * @param {Object} config 对应templateRestriction
 * @param {Number | String | null} value 值
 * @returns boolean 是否标红
 */
export const checkRadioIsRed = (config: any, value: number | null) => {
  const { redMark } = config || {};
  if (!(isArray(redMark) && value)) return; // 注意这里预期id不会为0
  const targetConfig = redMark.find((item: any) => item.optionId === value);
  if (targetConfig) {
    const { isRedMark, isItemTip, itemTip } = targetConfig;
    if (isRedMark && isItemTip && !!itemTip) return targetConfig;
    return null;
  }
  return null;
};

/**
 *
 * @param {Object} config 对应templateRestriction
 * @param {Number | String | null} value 值
 * @returns boolean 是否标红
 */
export const checkboxCheckIsRed = (config: any, value: number[]) => {
  const { redMark } = config || {};
  if (!(isArray(redMark) && isArray(value))) return [];
  const option: any[] = [];
  value.forEach((item: any) => {
    redMark.forEach((redMarkItem: any) => {
      const { optionId, isRedMark, isItemTip, itemTip } = redMarkItem;
      if (optionId !== item.id) return;
      isRedMark && isItemTip && itemTip && (option.push(redMarkItem));
    });
  });
  return option;
};

