/**
 * @Description 一个动态组件
 * 区分不同的组件类型
 */

import { FC } from 'react';
import { Col } from 'antd';
import { ControlType } from './config';
// 各类型组件
import Radio from './components/Radio';
import Checkbox from './components/Checkbox';
import DropdownSelect from './components/DropdownSelect';
import Input from './components/Input';
import TextareaInput from './components/TextareaInput';
import Upload from './components/Upload';
import NumberInput from './components/NumberInput';
import Time from './components/Time';
import Address from './components/Address';
import Provinces from './components/Provinces';
import Footprint from './components/Footprint';
import Surround from './components/Surround';
import ContendInfo from './components/ContendInfo';
import BusinessPlanning from './components/BusinessPlanning';
import SaleAmount from './components/SaleAmount';
import BusinessInfo from './components/BusinessInfo';
import DailyFlow from './components/DailyFlow';
import RefConversion from './components/RefConversion';
// hooks
import { useAccessIsDisabled } from './hooks/useAccessIsDisabled';
import { useAccessIsRequired } from './hooks/useAccessIsRequired';
import { useAccessIsShow } from './hooks/useAccessIsShow';

const PropertyComponent: FC<any> = ({
  item,
  form,
  isChancepoint = true, // 是否机会点表单，加盟商时false
  isEvaluation = false,
  addressChange,
  updateCompValue,
  updateRelateShow,
  supportDirectApproval, // 是否支持直接提交审批 1:支持 2:不支持，默认值是2
  isFootprintValue = false, // 在编辑状态下，踩点组件是否已有数据（已有数据则设置表单不可读）
  businessPlanValue = {},
  businessInfoValue = {},
  showHintStr
}) => {
  // 独占一行的字段
  const isColFullIdentifications = [
    'basicAddress'
  ];
  // 独占一行的组件类型
  const isColFullControlTypes = [
    ControlType.CHECK_BOX.value,
    ControlType.SURROUND_SEARCH.value,
    ControlType.CONTEND_INFO.value,
    ControlType.BUSINESS_PLANNING.value,
    ControlType.MATCH_BUSINESS_CIRCLE.value,
    ControlType.DAILY_FLOW_PREDICT.value,
  ];
  // 是否是换行显示
  const isLineFeed = (item: any) => {
    const { templateRestriction } = item;
    if (!templateRestriction) return false;
    try {
      const parsed = JSON.parse(templateRestriction);
      const { nextLine } = parsed || {};
      // 换行显示
      return nextLine;
    } catch (error) {}
    return false;
  };

  /**
   * @description 是否禁用
   */
  const disabled = useAccessIsDisabled({
    supportDirectApproval,
    propertyItem: item,
    isEvaluation,
    isChancepoint,
  });

  /**
   * @description 是否必填
   */
  const required = useAccessIsRequired({
    propertyItem: item,
    isChancepoint,
  });

  /**
   * @description 支持提交审批时是否可见，结合isShow最终决定是否展示
   */
  const isShowWhenApprovalProcess = useAccessIsShow({
    supportDirectApproval,
    propertyItem: item,
    isEvaluation,
    isChancepoint,
  });

  return (
    item.isShow && isShowWhenApprovalProcess ? <>
      {/* 换行显示 */}
      {
        isLineFeed(item) ? (<Col span={24}></Col>) : null
      }
      {/*
        默认两列布局，但是部分场景下需要换行显示
      */}
      {
        // 日均客流预测（内含三个字段，之后的组件要跟在同一行，所以组件DailyFlow外不能包Col）
        item.controlType === ControlType.DAILY_FLOW_PREDICT.value ? <DailyFlow
          form={form}
          propertyItem={item}
          disabled={disabled}
          required={required}
          updateCompValue={updateCompValue}
        /> : <Col span={
          isColFullIdentifications.includes(item.identification) ||
        isColFullControlTypes.includes(item.controlType) ? 24 : 12}>
          { // 单选组件,有两种展现形式,选项小于3项时用Raido，否则用select
            item.controlType === ControlType.SINGLE_RADIO.value &&
          (Array.isArray(item.propertyConfigOptionVOList) &&
          item.propertyConfigOptionVOList.length < 3
            ? <Radio
              propertyItem={item}
              form={form}
              disabled={disabled}
              required={required}
              updateRelateShow={updateRelateShow}
              showHintStr={showHintStr}/>
            : <DropdownSelect
              propertyItem={item}
              disabled={disabled}
              required={required}
              showHintStr={showHintStr}
              form={form}/>)
          }
          {
            // 多选组件
            item.controlType === ControlType.CHECK_BOX.value && <Checkbox propertyItem={item}
              disabled={disabled}
              required={required}
              showHintStr={showHintStr}
              form={form}/>
          }
          {
            // 输入框组件
            item.controlType === ControlType.INPUT.value && <Input
              propertyItem={item}
              disabled={disabled}
              required={required}/>
          }
          {
            // 文本框组件
            item.controlType === ControlType.TEXT_AREA.value && <TextareaInput
              propertyItem={item}
              disabled={disabled}
              required={required}/>
          }
          {
            // 上传组件
            item.controlType === ControlType.UPLOAD.value && <Upload
              propertyItem={item}
              disabled={disabled}
              required={required}/>
          }
          {
            // 数字输入框组件
            item.controlType === ControlType.INPUT_NUMBER.value && <NumberInput
              propertyItem={item}
              disabled={disabled}
              required={required}
              showHintStr={showHintStr}/>
          }
          {
            // 日期组件
            item.controlType === ControlType.TIME.value && <Time
              propertyItem={item}
              disabled={disabled}
              required={required}/>
          }
          {
            // 详细地址组件
            item.controlType === ControlType.ADDRESS.value && <Address
              form={form}
              formItemData={item}
              disabled={disabled}
              required={required}
              addressChange={addressChange}/>
          }
          {
            // 省市区组件（目前的逻辑是省市区处于禁用状态，根据详细地址组件拿到的省市区id进行赋值）
            item.controlType === ControlType.AREA.value && <Provinces
              propertyItem={item}
              required={required}
              config={{
                disabled: true
              }}/>
          }
          {
            // 踩点组件-0727
            item.controlType === ControlType.FOOTPRINT.value && <Footprint
              form={form}
              disabled={disabled || isFootprintValue}
              required={required}
            />
          }
          {
            // 周边查询（目前的逻辑是周边查询组件内不能修改地址，地址自动从详细地址组件中带出，不可修改。之后详细地址结合周边查询配置，获取周边信息）
            item.controlType === ControlType.SURROUND_SEARCH.value && <Surround
              formItemData={item}
              form={form}
              disabled={disabled}
              required={required}
              surroundChange={updateCompValue}/>
          }
          {
            item.controlType === ControlType.CONTEND_INFO.value && <ContendInfo
              propertyItem={item}
              form={form}
              disabled={disabled}
              required={required}
              contendInfoChange={updateCompValue}
            />
          }
          {
            // 商圈规划（目前的逻辑是商圈规划组件内不能修改地址，地址自动从详细地址组件中带出，不可修改。之后用详细地址，获取商圈信息）
            item.controlType === ControlType.BUSINESS_PLANNING.value && <BusinessPlanning
              formItemData={item}
              form={form}
              businessPlanValue={businessPlanValue}
              businessPlanChange={updateCompValue}
              disabled={disabled}/>
          }
          {
            // 销售额（目前的逻辑是销售额组件内不能修改地址，地址自动从详细地址组件中带出，不可修改。之后用详细地址，获取销售额）
            item.controlType === ControlType.SALE_AMOUNT.value && <SaleAmount
              form={form}
              formItemData={item}
              required={required}/>
          }
          {
            // 商圈信息（目前的逻辑是商圈规划组件内不能修改地址，地址自动从详细地址组件中带出，不可修改。之后用详细地址，获取商圈信息）
            item.controlType === ControlType.MATCH_BUSINESS_CIRCLE.value && <BusinessInfo
              formItemData={item}
              form={form}
              businessInfoValue={businessInfoValue}
            />
          }
          {
            // 参考转化率、参考租金
            [ControlType.REFERENCE_CONVERSION.value, ControlType.REFERENCE_RENT.value].includes(item.controlType) && <RefConversion propertyItem={item} />
          }
        </Col>}
    </> : null
  );
};

export default PropertyComponent;
