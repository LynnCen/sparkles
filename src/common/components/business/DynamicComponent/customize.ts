/**
 * @Description 拓店共通版-定制组件特殊处理
 */

import { ControlType, parseValueCatch, setComValue } from './config';
import { standardSurroundSearch } from '@/common/api/surround';
import {
  chancepointPlanCluster,
  chancepointModelCluster,
  chancepointSaleAmount,
  chancepointFlowScore
} from '@/common/api/expandStore/chancepoint';
import { codeToPCD } from '@/common/api/common';
import { getLngLatAddress } from '@/common/utils/map';
import { isArray, isDef } from '@lhb/func';
import moment from 'moment';

// 机会点名称字段的唯一标识符
export const chanceNameIdentification = 'basicChancePointName';
// 省市区组件的唯一标识符
export const pcdIdentification = 'area';
// 地址组件的唯一标识符
export const addressIdentification = 'basicAddress';
// 网规组件的唯一标识符
export const networkPlanningIdentification = 'networkPlanning';
// 销售额预测的唯一标识符
export const estimatedDailyIdentification = 'estimatedDailyRevenue';
// 客群质量评分的唯一标识符
export const customerQualityScoreIdentification = 'customerQualityScore';
// 商圈匹配信息的唯一标识符
export const matchBusinessAreaIdentification = 'matchBusinessArea';

// 无论任何情况下，机会点表单必须检查必填的特殊字段
export const AlwaysRequiredChanceIndentifications = [
  chanceNameIdentification,
  pcdIdentification,
  addressIdentification
];

/**
 * @description 详细地址变更时周边查询组件更新
 * @param addressInfo 地址对象{adcode,lat,lng,cityId,cityName,address}
 * @return
 */
const updateAddressSurround = async (tiledFormDataRef: any,
  form, addressInfo: any) => {
  const targetCom = tiledFormDataRef.current.find((item: any) => item.controlType === ControlType.SURROUND_SEARCH.value);
  if (!targetCom || !targetCom.restriction) return;

  const restriction = JSON.parse(targetCom.restriction);
  const radius = restriction.radius || 0;
  const tplId = restriction.tplId || 0;
  const surroundData = await standardSurroundSearch({ radius, tplId, lat: addressInfo.lat, lng: addressInfo.lng });
  if (!surroundData) return;

  const surround = Array.isArray(surroundData) ? surroundData.map(itm => ({
    categoryName: itm.categoryName,
    poiName: Array.isArray(itm.poiName) ? itm.poiName : [],
    text: Array.isArray(itm.poiName) ? itm.poiName.join('、') : ''
  })) : [];

  const surroundValue = {
    ...addressInfo,
    surround
  };
  setComValue(targetCom, surroundValue); // 存储周边查询数据
  // setFieldValue 不会触发onValuesChange
  form.setFieldValue(targetCom.identification, surroundValue.address); // 组件显示值
};

/**
 * @description 详细地址变更时商圈规划组件更新
 * @param addressInfo 地址对象{adcode,lat,lng,cityId,cityName,address}
 * @return
 */
const updateAddressBusiPlan = async (
  tiledFormDataRef: any,
  form,
  addressInfo: any,
  callback: Function
) => {
  const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === networkPlanningIdentification && item.controlType === ControlType.BUSINESS_PLANNING.value);
  if (!targetCom) return;

  const { lat, lng } = addressInfo;
  const data = await chancepointPlanCluster({ lat, lng });

  // 获取之前设置的集客点id，存到组件新数据中
  const oldVal = parseValueCatch(targetCom);
  const oldPlanSpotId = oldVal?.planSpotId;
  const targetSpot = oldPlanSpotId && isArray(data?.planSpots) ? data.planSpots.find((itm: any) => itm.id === oldPlanSpotId) : null;
  // 之前选择的集客点id能匹配到当前商圈信息接口返回的数据，则继续保持，否则当作没有选中项
  const planSpotId = targetSpot ? targetSpot.id : null;
  const planSpotName = targetSpot ? targetSpot.name : null;

  const compValue = {
    ...data,
    lat,
    lng,
    planSpotId,
    planSpotName
  };
  setComValue(targetCom, compValue); // 存储数据

  // 将商圈规划数据传入组件
  callback(compValue);
};

/**
 * @description 详细地址变更时商圈信息组件更新
 * @param addressInfo 地址对象{adcode,lat,lng,cityId,cityName,address}
 * @return
 */
const updateAddressBusiInfo = async (
  tiledFormDataRef: any,
  form,
  addressInfo: any,
  callback: Function
) => {
  const targetCom = tiledFormDataRef.current.find((item: any) => item.controlType === ControlType.MATCH_BUSINESS_CIRCLE.value);
  if (!targetCom) return;

  const { lat, lng } = addressInfo;
  const data = await chancepointModelCluster({ lat, lng });

  const compValue = { ...data, lat, lng };
  setComValue(targetCom, compValue); // 存储数据
  // 将商圈规划数据传入组件
  callback(compValue);
};

/**
* @description 销售额预测
* @param addressInfo 地址信息
* @return
*/
const updateEstimatedDailyRevenue = async (
  tiledFormDataRef: any,
  form,
  addressInfo: any
) => {
  const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === estimatedDailyIdentification && item.controlType === ControlType.INPUT_NUMBER.value);
  if (!targetCom) return;

  // 详细地址信息
  const { cityId, lat, lng } = addressInfo;
  // 实时查询商圈信息
  const data = await chancepointSaleAmount({ cityId, lat, lng });
  const val = (data && isDef(data.saleAmount)) ? parseInt(data.saleAmount) : null;
  setComValue(targetCom, val);
  // setFieldValue 不会触发onValuesChange
  form.setFieldValue(targetCom.identification, val); // 组件显示值
};

/**
 * @description 客群质量得分
 * @param addressInfo 地址信息
 * @return
 */
const updateCustomerQualityScore = async (
  tiledFormDataRef: any,
  form,
  addressInfo: any
) => {
  const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === customerQualityScoreIdentification && item.controlType === ControlType.INPUT_NUMBER.value);
  if (!targetCom) return;

  // 详细地址信息
  const { lat, lng } = addressInfo;
  // 实时查询商圈信息
  const data = await chancepointFlowScore({ lat, lng });
  const val = (data && isDef(data.flowMatchIndex)) ? Math.round(data.flowMatchIndex) : null;
  setComValue(targetCom, val);
  // setFieldValue 不会触发onValuesChange
  form.setFieldValue(targetCom.identification, val); // 组件显示值
};

/**
 * 处理踩点组件的textValue
 */
export const handleFootprintTextValue = (
  tiledFormDataRef,
  targetIdentification,
  val
) => {
  const footprintIdentifications = ['dynamicComponent_footprint_isStart',
    'dynamicComponent_footprint_checkRule',
    'dynamicComponent_footprint_days',
    'dynamicComponent_footprint_checkPeriod'];
  if (!footprintIdentifications.includes(targetIdentification)) return;

  const targetCom = tiledFormDataRef.current.find((item: any) => item.identification === 'locationFootprint');
  let newVal = val;
  // 如果是踩点时间，对时间进行数据处理
  if (targetIdentification === 'dynamicComponent_footprint_checkPeriod') {
    newVal = [
      moment(val[0]).format('HH:mm'),
      moment(val[1]).format('HH:mm')
    ];
  }
  const oldValue = JSON.parse(targetCom?.textValue);
  const newValue = JSON.stringify({
    ...oldValue,
    [targetIdentification]: newVal
  });
  setComValue(targetCom, newValue);
  // updateRelateShow(targetIdentification);
};

/**
 * 详细地址组件的特殊逻辑
 * 通过高德的逆地址解析拿到高德的code，通过接口查找对应的省市区id，然后赋值到省市区组件上
 * 按照isInitChange，分为回显示地址处理，手动地址变动处理
 */
export const addressChangeCommon = async (
  params: any,
  tiledFormDataRef,
  form,
  busiPlanCallback: Function,
  busiInfoCallback: Function,
) => {
  const {
    isInitChange,
  } = params;

  if (isInitChange) { // 特殊情况，初始化时获取到地址，更新相关数据，
    addressInitChange(params, tiledFormDataRef, form, busiPlanCallback, busiInfoCallback);
  } else {
    addressManualChange(params, tiledFormDataRef, form, busiPlanCallback, busiInfoCallback);
  }
};

/**
 * 详细地址组件的特殊逻辑
 * 通过高德的逆地址解析拿到高德的code，通过接口查找对应的省市区id，然后赋值到省市区组件上
 */
export const addressManualChange = async (
  params: any,
  tiledFormDataRef,
  form,
  busiPlanCallback: Function,
  busiInfoCallback: Function,
) => {
  const {
    lng,
    lat,
    cityName,
    name,
    poiId,
    identification, // 详细地址组件识别符
  } = params;
  const addressInfo: any = await getLngLatAddress([lng, lat], cityName, false).catch((err) => console.log(`查询具体地址信息：${err}`));
  if (!addressInfo) return;
  const { addressComponent, formattedAddress } = addressInfo;
  const textVal = {
    // 这里之所以用name，是因为用formattedAddress数据那边大多数时候查不到
    address: name || formattedAddress,
    longitude: lng,
    latitude: lat,
    poiId,
    poiName: name
  };
  const addressCom = tiledFormDataRef.current.find((item: any) => item.identification === identification);
  setComValue(addressCom, textVal); // 存储地址的的数据

  // 通过code查找对应的省市区id，然后赋值到省市区组件上
  const { adcode } = addressComponent || {};
  if (!adcode) return;
  const pcdInfo = await codeToPCD({
    districtCode: adcode,
    cityName
  });
  // 省市区组件
  const pcdCom = tiledFormDataRef.current.find((item: any) => item.identification === pcdIdentification);
  const { provinceId, cityId, districtId } = pcdInfo;
  setComValue(pcdCom, pcdInfo); // 存储省市区的数据
  // setFieldValue 不会触发onValuesChange
  form.setFieldValue(pcdIdentification, [provinceId, cityId, districtId]); // 组件显示值

  // 周边查询组件
  const surroundAddress = {
    adcode,
    lat,
    lng,
    cityId,
    cityName,
    address: name || formattedAddress
  };
  updateAddressSurround(tiledFormDataRef, form, surroundAddress);

  const latLng = {
    lat,
    lng,
  };
  const cityLatLng = {
    lat,
    lng,
    cityId,
  };
  // 商圈规划组件
  updateAddressBusiPlan(tiledFormDataRef, form, latLng, busiPlanCallback);

  // 商圈信息组件
  updateAddressBusiInfo(tiledFormDataRef, form, latLng, busiInfoCallback);

  // 销售额预测
  updateEstimatedDailyRevenue(tiledFormDataRef, form, cityLatLng);

  // “客群质量评分”
  updateCustomerQualityScore(tiledFormDataRef, form, cityLatLng);
};

/**
 * 详细地址组件的特殊逻辑
 *  与 addressManualChange 区别，编辑表单回显时获取到地址后，执行 addressInitChange ；之后变更地址执行 addressManualChange
 *
 *  20240311添加本事件的背景：
 *  创建机会点时，网规组件选择的商圈内没有集客点选项，提交机会点。
 *  之后新增了集客点，但是因为没有重新选择详细地址，没有重新触发重新获取网规商圈信息，
 *  导致网规组件的【所属集客点】字段一直显示【暂无集客点】字段。
 *
 */
export const addressInitChange = async (
  params: any,
  tiledFormDataRef,
  form,
  busiPlanCallback: Function,
  busiInfoCallback: Function,
) => {
  const {
    lng,
    lat,
  } = params;

  const latLng = {
    lat,
    lng,
  };
  // 商圈规划组件
  updateAddressBusiPlan(tiledFormDataRef, form, latLng, busiPlanCallback);

  // 商圈信息组件
  updateAddressBusiInfo(tiledFormDataRef, form, latLng, busiInfoCallback);
};
