import { isArray, isNotEmpty, isUndef } from '@lhb/func';
import { fixNumber } from '@/common/utils/ways';
import dayjs from 'dayjs';
export const _otherTypeInputText = '_otherTypeInputText_no_repeat';// “其他”选项的input值(不可与identification有重复，所以写的又下划线又驼峰)
export const otherId = -1;// -1是服务端约定的，传入-1的id表示其他选项
// 单选组件的赋值
const singleValueToJSON = (com: any, value: any) => {
  const { propertyConfigOptionVOList: options } = com;
  if (!(isArray(options) && options.length)) return null;
  // 查找对应的选项
  const targetOption = options.find((item) => item.id === value);
  // 其他选项
  if (value === otherId) {
    const inputValue = com[_otherTypeInputText];
    delete com[_otherTypeInputText];
    return JSON.stringify({
      input: inputValue,
      selectedId: -1,
      name: '其他'
    });
  }
  if (targetOption) {
    // 和接口约定的格式
    return JSON.stringify({
      selectedId: targetOption.id,
      name: targetOption.name
    });
  }
  return null;
};
// 多选组件的赋值
const checkboxValueToJSON = (com: any, value: number[]) => {
  const { propertyConfigOptionVOList: options } = com;
  if (!(isArray(options) && options.length)) return null;
  // 查找对应的选项
  const targetOptions = options.filter((item) => value.includes(item.id));
  if (targetOptions.length) {
    const selectedValues:any = targetOptions.map((item) => {
      // 处理勾选了“其他”选项
      if (item.id === otherId) {
        const inputValue = com[_otherTypeInputText];
        delete com[_otherTypeInputText];
        return {
          selectedId: otherId,
          name: '其他',
          input: inputValue
        };
      } else {
        return {
          selectedId: item.id,
          name: item.name
        };
      }
    });
    // 和接口约定的格式
    return JSON.stringify(selectedValues);
  }
  return null;
};
// 数字输入框组件的赋值
const inputNumberValueToJSON = (com: any, value: any) => {
  const { restriction } = com;
  let parsedRestriction;
  // 防止数据异常，JSON.parse的出错
  try {
    parsedRestriction = JSON.parse(restriction);
  } catch (error) {}
  if (!parsedRestriction) return null;
  const { suffixOptionList } = parsedRestriction;
  const suffix = isArray(suffixOptionList) && suffixOptionList.length ? suffixOptionList[0].name : null;
  return JSON.stringify({
    value,
    suffix
  });
};
// 上传组件的赋值
const uploadValToJSON = (value: any[]) => {
  if (!(isArray(value) && value.length)) return null;
  const jsonData = value.map((item) => ({
    name: item.name,
    url: item.url
  }));
  return JSON.stringify(jsonData);
};

// 控件类型
export const ControlType = {
  // csName 待定，可能不需要
  SINGLE_RADIO: { value: 1, name: '单选框', csName: '' },
  CHECK_BOX: { value: 2, name: '多选框', csName: '' },
  INPUT: { value: 3, name: '输入框', csName: '' },
  TEXT_AREA: { value: 4, name: '文本框', csName: '' },
  UPLOAD: { value: 5, name: '文件上传', csName: '' },
  INPUT_NUMBER: { value: 7, name: '数字输入框', csName: '' },
  TIME: { value: 9, name: '时间', csName: '' },
  ADDRESS: { value: 10, name: '详细地址', csName: '' },
  AREA: { value: 14, name: '省市区', csName: '' },
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

/**
 * @description 将动态表单中的所有组件平铺到数组中，方便查找到对应的组件
 * @param {Array} coms 接口返回的动态表单组件的数据
 * @param {any} tiledFormDataRef 平铺的对象
 */
export const formDataComsToTiled = (coms: any[], tiledFormDataRef: any) => {
  isArray(coms) && coms.forEach((item: any) => {
    const { childList, identification, restriction, templateRestriction, controlType } = item;
    if (identification) {
      /**
       * 遍历到字段的层级时，手动合并templateRestriction至restriction
       * restriction 存放的是属性字段相关的配置（基础配置）
       * templateRestriction 存放的是模版里字段的配置（模板字段取值来源是属性字段，故这里的配置是优先级最高的）
       * 但由于某些历史原因，代码里用的都是restriction，故需要一次合并
       */
      let mergeRestriction = null;
      let targetTypeAndData: any = null;
      // 单选或多选时
      if (controlType === ControlType.SINGLE_RADIO.value || controlType === ControlType.CHECK_BOX.value) {
        // 配置了其他
        if (restriction && isArray(JSON.parse(restriction))) {
          targetTypeAndData = JSON.stringify({
            withOther: true
          });
        } else if (isNotEmpty(restriction)) {
          targetTypeAndData = restriction;
        }
      } else {
        targetTypeAndData = restriction;
      }
      try {
        mergeRestriction = Object.assign(isNotEmpty(targetTypeAndData) ? JSON.parse(targetTypeAndData) : {}, isNotEmpty(templateRestriction) ? JSON.parse(templateRestriction) : {});
      } catch (error) {
        console.log(`合并restriction出错，唯一标识符${identification}`, error);
      }
      item.restriction = mergeRestriction ? JSON.stringify(mergeRestriction) : null;
      tiledFormDataRef.push(item);
    }
    isArray(childList) && childList.forEach((childItem: any) => {
      return formDataComsToTiled(childItem.propertyConfigVOList, tiledFormDataRef);
    });
  });
};

/**
 * @description 组件的赋值操作，用来提交给接口（textvalue的赋值）
 * @param {Object} targetCom 对应的组件
 * @param {any} value 当前组件的值
 */
export const setComValue = (targetCom: any, value: any) => {
  if (!targetCom) return;
  const {
    controlType,
  } = targetCom;
  if (isNotEmpty(value)) {
    // 需要对每个组件的textValue进行处理（和服务端约定是JSON字符串）
    switch (controlType) {
      case ControlType.SINGLE_RADIO.value: // 单选
        targetCom.textValue = singleValueToJSON(targetCom, value);
        break;
      case ControlType.CHECK_BOX.value: // 多选
        targetCom.textValue = checkboxValueToJSON(targetCom, value);
        break;
      case ControlType.INPUT.value: // 输入框
        targetCom.textValue = value;
        break;
      case ControlType.TEXT_AREA.value: // 文本域
        targetCom.textValue = value;
        break;
      case ControlType.INPUT_NUMBER.value: // 数字输入框
        targetCom.textValue = inputNumberValueToJSON(targetCom, value);
        break;
      case ControlType.TIME.value: // 日期组件
        targetCom.textValue = dayjs(value).format('YYYY-MM-DD');
        break;
      case ControlType.ADDRESS.value: // 地址组件
        targetCom.textValue = JSON.stringify(value);
        break;
      case ControlType.AREA.value: // 省市区
        targetCom.textValue = JSON.stringify(value);
        break;
      case ControlType.UPLOAD.value:
        targetCom.textValue = uploadValToJSON(value);
        break;
      case ControlType.FOOTPRINT.value:
        targetCom.textValue = value;
        break;
      case ControlType.SURROUND_SEARCH.value: // 周边查询组件
        targetCom.textValue = JSON.stringify(value);
        break;
      case ControlType.CONTEND_INFO.value: // 店铺周边竞品
        targetCom.textValue = JSON.stringify(value);
        break;
      case ControlType.BUSINESS_PLANNING.value: // 商圈规划
        targetCom.textValue = JSON.stringify(value);
        // console.log('设置规划组件 targetCom.textValue', value, targetCom.textValue);
        break;
      case ControlType.SALE_AMOUNT.value: // 销售额
        targetCom.textValue = JSON.stringify(value);
        // console.log('设置销售额组件 targetCom.textValue', value, targetCom.textValue);
        break;
      case ControlType.MATCH_BUSINESS_CIRCLE.value: // 商圈信息
        targetCom.textValue = JSON.stringify(value);
        // console.log('设置 商圈信息组件 value，targetCom.textValue', value, targetCom.textValue);
        break;
      case ControlType.DAILY_FLOW_PREDICT.value:
        targetCom.textValue = JSON.stringify(value);
        break;
    }
    return;
  }
  targetCom.textValue = isUndef(value) ? null : '';
};

/**
 * 解析json格式的textValue
 * @param com 组件
 * @returns value
 */
export const parseValueCatch = (com: any, targetFields?: string) => {
  const {
    textValue,
    name,
    identification
  } = com;
  let value: any = null;
  try {
    value = targetFields ? JSON.parse(com[targetFields]) : JSON.parse(textValue);
  } catch (error) {
    console.log(`${name}解析出错，唯一标识符${identification}`, error);
  }
  return value;
};
/**
 * @description 表单数据的回显（编辑时的数据回显）
 * @param {any} targetCom
 * @return {Object}
 */
export const formDataEcho = (targetCom: any) => {
  const {
    controlType,
    textValue,
  } = targetCom;
  if (isNotEmpty(textValue)) {
    // 需要对每个组件的textValue进行处理，使其在表单中回显
    switch (controlType) {
      case ControlType.SINGLE_RADIO.value: // 单选
        const singleValue: any = parseValueCatch(targetCom);
        return singleValue?.selectedId || null;
      case ControlType.CHECK_BOX.value: // 多选
        const checkboxValue: any = parseValueCatch(targetCom);
        return checkboxValue?.map((item: any) => item.selectedId) || [];
      case ControlType.INPUT.value: // 输入框
        return textValue || '';
      case ControlType.TEXT_AREA.value: // 文本域
        return textValue || '';
      case ControlType.INPUT_NUMBER.value: // 数字输入框
        const inputNumberValue = parseValueCatch(targetCom);
        return isNotEmpty(inputNumberValue?.value) ? inputNumberValue?.value : '';
      case ControlType.TIME.value: // 日期组件
        return textValue ? dayjs(textValue) : '';
      case ControlType.ADDRESS.value: // 地址组件
        const addressValue = parseValueCatch(targetCom);
        return addressValue?.poiName || addressValue?.address || '';
      case ControlType.AREA.value: // 省市区
        const pcdValue: any = parseValueCatch(targetCom);
        const {
          provinceId,
          cityId,
          districtId
        } = pcdValue || {};
        return provinceId && cityId && districtId ? [provinceId, cityId, districtId] : [];
      case ControlType.UPLOAD.value:
        return parseValueCatch(targetCom) || [];
      case ControlType.FOOTPRINT.value:// 踩点组件
        return targetCom;
      case ControlType.SURROUND_SEARCH.value: // 周边查询
        return targetCom;
      case ControlType.CONTEND_INFO.value: // 周边查询
        return parseValueCatch(targetCom) || [];
      case ControlType.BUSINESS_PLANNING.value: // 商圈规划
      case ControlType.SALE_AMOUNT.value: // 销售额
      case ControlType.MATCH_BUSINESS_CIRCLE.value: // 商圈信息
      case ControlType.DAILY_FLOW_PREDICT.value: // 客流预测
      case ControlType.REFERENCE_CONVERSION.value: // 参考转化率
      case ControlType.REFERENCE_RENT.value: // 参考租金
        return targetCom;
    }
  }
  return null;
};

/**
 * @description 关联属性的显示逻辑，只有单选/多选才会根据选择项去配置关联显示的字段，所以遍历时只需要解析被关联的字段中是和哪个单选/多选组件的值绑定显示逻辑了
 * @param {any} coms
 */
export const relevancyShow = (coms: any[]) => {
  coms.forEach((comItem: any) => {
    const {
      templateRestrictionPassiveList,
      name,
    } = comItem;
    // 没有关联显示的配置时，设置为true
    if (!templateRestrictionPassiveList) {
      comItem.isShow = true;
      return;
    }
    try {
      // 关联的配置
      const relevancyConfig: any[] | null = templateRestrictionPassiveList;
      if (!isArray(relevancyConfig)) return;
      // 当前组件被某个组件关联时的配置
      relevancyConfig.forEach((relevancyItem: any) => {
        // 源组件（单选/多选），里面包含了选择某项值时哪些组件关联显示
        const relevancyOriginCom = coms.find((item: any) => item.propertyId === relevancyItem.relationsComponent);
        if (!relevancyOriginCom) return;

        const { controlType } = relevancyOriginCom;
        const { currentValue } = relevancyItem;
        // 解析源组件的值
        const value: any = parseValueCatch(relevancyOriginCom);
        if (!value) {
          comItem.isShow = false;
          comItem.textValue = null;
          return;
        }
        // 单选
        if (controlType === ControlType.SINGLE_RADIO.value) {
          const { selectedId } = value;
          if (currentValue.includes(selectedId)) {
            comItem.isShow = true;
            return;
          }
        }
        // 多选
        if (controlType === ControlType.CHECK_BOX.value) {
          const selectedIds = value.map((item) => item.selectedId);
          if (!selectedIds.length) {
            comItem.isShow = false;
            return;
          }

          if (currentValue.some((val: any) => selectedIds.includes(val))) {
            comItem.isShow = true;
            return;
          }
          return;
        }
        comItem.isShow = false;
        comItem.textValue = null;
      });
    } catch (error) {
      console.log(`${name}解析关联显示出错,被${templateRestrictionPassiveList.map((item) => item.relationsComponent).join('、')}关联`, error);
    }
  });
};


/**
 * @description 动态表头数据解析
 * @param {any} targetCom
 */
export const analysisTableTitle = (targetCom:any) => {
  const {
    controlType,
    textValue,
  } = targetCom;
  if (isNotEmpty(textValue)) {
    // 需要对每个组件的textValue进行处理，使其在表单中回显
    switch (controlType) {
      case ControlType.SINGLE_RADIO.value: // 单选
      // 对象  {selectedId: 2214, name: '符合'} 显示name
        const singleValue: any = parseValueCatch(targetCom);
        return singleValue?.name || null;

      case ControlType.CHECK_BOX.value: // 多选
        const checkboxValue: any = parseValueCatch(targetCom);
        let res = '';
        checkboxValue.map((item, index) => {
          if (index === 0) {
            res += item.name;
          } else {
            res += `、${item.name}`;
          }
        });
        // 数组、对象 selectedId,name，遍历展示所有name
        // return checkboxValue?.map((item: any) => item.selectedId) || [];
        return res;

      case ControlType.INPUT.value: // 输入框
        return textValue || '';

      case ControlType.TEXT_AREA.value: // 文本域
        return textValue || '';

      case ControlType.INPUT_NUMBER.value: // 数字输入框
      // ok: inputNumberValue 对象 suffix 单位 value 数据 显示 value+suffix
        const inputNumberValue = parseValueCatch(targetCom);
        // return isNotEmpty(inputNumberValue?.value) ? inputNumberValue?.value : '';
        return isNotEmpty(inputNumberValue?.value) ? `${inputNumberValue?.value}${inputNumberValue.suffix}` : '';

      case ControlType.TIME.value: // 日期组件
      // ok 直接显示 textValue
        return textValue || '';
      case ControlType.ADDRESS.value: // 地址组件
        const addressValue = parseValueCatch(targetCom);
        return addressValue?.poiName || addressValue?.address || '';
      case ControlType.AREA.value: // 省市区
        const pcdValue: any = parseValueCatch(targetCom);
        const {
          provinceName,
          cityName,
          districtName
        } = pcdValue || {};
        return `${provinceName}${cityName}${districtName}`;
      case ControlType.UPLOAD.value:
        let component:any = [];
        component = parseValueCatch(targetCom)?.map((item) => {

          return `<img src=${item.url} alt=${String(item.name)} style="
            width: 25px;
            height: 25px;
            borderRadius: 50%;
          "/>`;
        });
        // ok: parseValueCatch(targetCom) 数组对象，name,url,遍历url在列表中生成图片
        // return parseValueCatch(targetCom) || [];
        return {
          isImg: true,
          component
        };
      // case ControlType.FOOTPRINT.value:// 踩点组件
      //   return targetCom;
      // case ControlType.SURROUND_SEARCH.value: // 周边查询
      //   return targetCom;
      // case ControlType.BUSINESS_PLANNING.value: // 商圈规划
      //   return targetCom;
      // case ControlType.SALE_AMOUNT.value: // 销售额
        // return targetCom;
    }
  }
  return null;
};

/**
 * @description 查找动态表单中所有配置了计算公式的组件
 * @param {any[]} coms 所有的动态表单组件
 * @return {any[]} 动态表单组件中所有配置了计算公式的组件
 */
export const getCalculateComs = (coms:any[]) => {
  let targetComs: any[] = [];
  try {
    targetComs = coms.filter((item: any) => {
      const { restriction } = item || {};
      const { expr }: any = restriction ? JSON.parse(restriction) : {};
      if (isArray(expr) && expr.length) return item;
    });
  } catch (error) {}
  return targetComs;
};

// 计算公式里的类型
enum CalculateType {
  Number = 'NUMBER', // 数字类型
  Operation = 'OPERATION', // 运算符类型
  Property = 'PROPERTY', // 绑定的需要计算的属性
}

// 计算公式的运算符
enum OperationalCharacter {
  Add = 100, // 加
  Subtract, // 减
  Multiply, // 乘
  Divide // 除
}

/**
 * @description 计算属性中关联的属性组件是否是百分比类型
 * @param {any} target 组件
 * @return {boolean} 是否是百分比类型的组件
 */
const targetComIsPercentage = (target: any) => {
  const { restriction } = target;
  const { suffixOptionList }: any = restriction ? JSON.parse(restriction) : {};
  return isArray(suffixOptionList) && suffixOptionList.length === 1 && suffixOptionList[0].name === '%';
};

// 获取计算公式中绑定的组件的值
const getCalculateBindVal = (curCom: any, numberInputComs: any[]) => {
  const { identification } = curCom;
  const targetVal: any = parseValueCatch(curCom);
  if (identification === 'estimatedDailyRevenue') { // 日均销售额预测
    // 如果有值就用系统日均销售额预测的值
    if (targetVal?.value) return targetVal?.value;
    // 获取个人日均销售额预测
    const target: any = numberInputComs.find((item: any) => item.identification === 'personalEstimatedDailyRevenue');
    if (!target) return '';
    return parseValueCatch(target)?.value;
  }
  return targetVal?.value;
};

/**
 * @description 根据配置的计算公式，查找匹配的组件值，得出计算结果
 * @param {any} coms
 * @param {any} calculateComs
 */
export const calculateHandle = (
  numberInputComs: any[], // 所有数字输入框组件
  calculateComs: any[] // 所有配置了计算公式的组件
) => {
  if (!(isArray(numberInputComs) && isArray(calculateComs))) return;
  calculateComs.forEach((itemCom: any) => {
    const { restriction } = itemCom;
    const { expr, precision }: any = restriction ? JSON.parse(restriction) : {}; // 存放计算公式的字段
    let afterCalculateVal = ''; // 计算公式字符串
    let hasVal = false;
    expr.forEach((exprItem: any, index: number) => {
      const {
        propertyId, // 属性id
        type, // 类型
        label,
        value // 值
      } = exprItem;
      let val = label;
      if (type === CalculateType.Property) { // 是计算公式里绑定的某个属性
        const curCom = numberInputComs.find((item: any) => item.propertyId === propertyId); // 当前组件
        if (!curCom) return;
        // 百分比类型
        const isPercentage = targetComIsPercentage(curCom);
        // const curVal = parseValueCatch(curCom)?.value; // 当前组件的值
        const curVal = getCalculateBindVal(curCom, numberInputComs);
        val = curVal;

        if (isNotEmpty(val)) {
          hasVal = true;
        }
        const lastVal = index > 0 ? expr[index - 1].value : ''; // 上一个值
        const nextVal = expr[index + 1] ? expr[index + 1].value : ''; // 下一个值
        // // 查看当前属性是否是乘法里的乘数或被乘数
        if (lastVal === OperationalCharacter.Multiply || nextVal === OperationalCharacter.Multiply) { // 乘法
          // 未填写时赋值0
          if (!isNotEmpty(val)) val = 0;
        } else if (lastVal === OperationalCharacter.Divide || nextVal === OperationalCharacter.Divide) { // 除法里的除数和被除数 25/5 被除数/除数
          // 除数输入0时，赋值为1
          if (val === 0 && lastVal === OperationalCharacter.Divide) val = 1;
          // 被除数未输入时，赋值为0
          if (!isNotEmpty(val) && nextVal === OperationalCharacter.Divide) val = 0;
          // 除数未输入，赋值为1
          if (!isNotEmpty(val) && lastVal === OperationalCharacter.Divide) val = 1;

        } else if (lastVal === OperationalCharacter.Add || nextVal === OperationalCharacter.Add) { // 加法
          // 未填写时赋值0
          if (!isNotEmpty(val)) val = 0;
        } else if (lastVal === OperationalCharacter.Subtract || nextVal === OperationalCharacter.Subtract) { // 减法
          // 未填写时赋值0
          if (!isNotEmpty(val) && lastVal === OperationalCharacter.Subtract) val = 0;
        }
        // 百分比时除以100
        isPercentage && (val = val / 100);
      } else if (type === CalculateType.Operation) {
        value === OperationalCharacter.Multiply && (val = '*');
        value === OperationalCharacter.Divide && (val = '/');
      }

      afterCalculateVal += val;
    });
    // eslint-disable-next-line no-eval
    const totalVal = eval(afterCalculateVal);
    const { decimals } = precision || {};
    const formattingVal = fixNumber(totalVal, !!decimals && decimals > 0 ? decimals : 0, true);
    // 计算公式关联的字段如果都未填写时不赋值
    if (!hasVal) return;
    if (!isFinite(+formattingVal)) return;
    setComValue(itemCom, formattingVal);
  });
};

/**
 * @description 动态表单属性字段是否可见
 */
export const isPropertyItemShow = (
  propertyItem: any,
  supportDirectApproval, // 是否支持直接提交审批 1:支持 2:不支持，默认值是2
  isChancepoint = true, // 是否机会点表单，加盟商时false
  isEvaluation = false, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
) => {
  const { isShow } = propertyItem;
  if (!isShow) return false;

  // 支持提交审批时（即走配置的审批流时）
  if (isChancepoint && supportDirectApproval === 1 && !isEvaluation) {
    const { access } = propertyItem;
    // access 1：仅可见  2：可写 3:不可见 null:历史数据的不可见
    return access === 1 || access === 2;
  }
  return true;
};

/**
 * @description 动态表单属性字段是否禁用
 */
export const isPropertyItemDisable = (
  propertyItem: any,
  supportDirectApproval, // 是否支持直接提交审批 1:支持 2:不支持，默认值是2
  isChancepoint = true, // 是否机会点表单，加盟商时false
  isEvaluation = false, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
) => {
  const { access } = propertyItem;
  // 支持提交审批时（即走配置的审批流时）；点位评估时，虽然支持审批，但是读取的是拓店模板设置，不参照流程设置
  if (isChancepoint && supportDirectApproval === 1 && !isEvaluation) {
    // access 1：仅可见  2：可写 3:不可见 null:历史数据的不可见
    return access === 1;
  }

  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  return !!restriction?.disable;
};

/**
 * @description 动态表单属性字段是否可见、且可编辑
 */
export const isPropertyItemVisibleEditable = (
  propertyItem: any,
  supportDirectApproval, // 是否支持直接提交审批 1:支持 2:不支持，默认值是2
  isChancepoint = true, // 是否机会点表单，加盟商时false
  isEvaluation = false, // 是否点位评估编辑页，是的话item的显示、禁用，参照的是机会点拓店模板、非流程设置
) => {
  const isShow = isPropertyItemShow(
    propertyItem,
    supportDirectApproval,
    isChancepoint,
    isEvaluation,
  );
  const isDisable = isPropertyItemDisable(
    propertyItem,
    supportDirectApproval,
    isChancepoint,
    isEvaluation,
  );
  return isShow && !isDisable;
};

// 竞品字段
export const contendInfoFields: Array<any> = [
  { label: '竞品名称', name: 'name', type: 'text', required: false, maxlength: 30 },
  { label: '实际面积', name: 'area', type: 'number', suffix: '平方米', maxValue: 999.99, floatLength: 2, required: false, },
  { label: '年租金', name: 'annualRent', type: 'number', suffix: '元', maxValue: 99999999.99, floatLength: 2, required: false, },
  { label: '客单价（线上）', name: 'onlineCustomerPrice', type: 'number', suffix: '元', maxValue: 999.99, floatLength: 2, required: false, },
  { label: '客单价（线下）', name: 'offlineCustomerPrice', type: 'number', suffix: '元', maxValue: 999.99, floatLength: 2, required: false, },
  { label: '在职员工数', name: 'employeeCount', type: 'number', suffix: '人', maxValue: 999, floatLength: 0, required: false, },
  { label: '日均预估', name: 'dayEstimate', type: 'number', suffix: '元', maxValue: 999999999.99, floatLength: 2, required: false, },
  { label: '日外卖单数', name: 'dailyTakeOutNumber', type: 'number', suffix: '单/日', maxValue: 99999, floatLength: 0, required: false, },
];

// -----回本周期 start-----
// 实用面积的档位
export enum AreaValLevel {
  Level1 = 'level1',
  Level2 = 'level2',
  Level3 = 'level3',
  Level4 = 'level4',
  Level5 = 'level5',
}
// 不同实用面积档位对应的字段值
export const areaMapVal: any = {
  level1: {
    renovationCosts: 47500, // 装修费
    equipmentCosts: 92500, // 设备费
    selfBuyingCosts: 17500, // 自购费用
    franchiseFee: 80000, // 加盟费
  },
  level2: {
    renovationCosts: 52500, // 装修费
    equipmentCosts: 100000, // 设备费
    selfBuyingCosts: 17500, // 自购费用
    franchiseFee: 80000, // 加盟费
  },
  level3: {
    renovationCosts: 77500, // 装修费
    equipmentCosts: 100000, // 设备费
    selfBuyingCosts: 17500, // 自购费用
    franchiseFee: 80000, // 加盟费
  },
  level4: {
    renovationCosts: 82500, // 装修费
    equipmentCosts: 100000, // 设备费
    selfBuyingCosts: 22500, // 自购费用
    franchiseFee: 80000, // 加盟费
  },
  level5: {
    renovationCosts: 112500, // 装修费
    equipmentCosts: 100000, // 设备费
    selfBuyingCosts: 27500, // 自购费用
    franchiseFee: 80000, // 加盟费
  }
};
// -----回本周期 end-----
