/**
 * @Description
 */

// import FormProvinceList from '@/components/FormBusiness/FormProvinceList';
import { ControlType } from '@/common/enums/control';
import { Form } from 'antd';
import { FC } from 'react';
import { isObject, isUndef } from '@lhb/func';

import CitySelect from '@/common/business/CitySelect';
import FormInput from '@/common/components/Form/FormInput';
import FormTextArea from '@/common/components/Form/FormTextArea';
import DynamicCheckbox from '../../DynamicCheckbox';
import DynamicInputNumber from '../../DynamicInputNumber';
import DynamicRadio from '../../DynamicRadio';
import DynamicSelect from '../../DynamicSelect';
import DynamicTime from '../../DynamicTime';
import DynamicTreeSelect from '../../DynamicTreeSelect';



const SubFormDynamicComponent: FC<any> = ({
  valuePropName,
  prop,
  ignoreRequired = false,
}) => {
  const { controlType } = prop;
  // const propertyId = String(prop.propertyId);
  const name = prop.anotherName ? prop.anotherName : prop.name ? prop.name : prop.propertyName;
  const required = prop.required === 1;
  const realRequired = ignoreRequired ? false : required;
  const propRestriction = prop.restriction ? JSON.parse(prop.restriction) : {}; // 属性限制配置
  const propTemplateRestriction = prop.templateRestriction ? JSON.parse(prop.templateRestriction) : {}; // 模版属性配置
  const restriction: any = { ...propRestriction, ...propTemplateRestriction };

  // DynamicRadio的自定义验证
  const checkRadioRule = (_rule: any, value: any) => {
    if (value?.selectedId === 'other' && !value.input) {
      return Promise.reject(new Error('请输入其他描述'));
    }
    if (realRequired && !value?.selectedId) {
      _rule.message = `请选择${name}`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  // DynamicCheckbox的规则验证
  const checkBoxRule = (_rule: any, value: any[]) => {
    const otherTarget = (Array.isArray(value) && value.find((item) => item.selectedId === 'other')) || '';
    if (otherTarget && !otherTarget.input) {
      _rule.message = `请输入其他描述`;
      return Promise.reject();
    }
    if (realRequired && !value?.length) {
      _rule.message = `请选择${name}`;
      return Promise.reject();
    }
    if (value && (value.length < restriction.min || value.length > restriction.max)) {
      _rule.message = `最少选择${restriction.min}项, 最多选择${restriction.max}项`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  // Input的自定义验证
  const checkInputRule = (_rule: any, value: any) => {
    if (realRequired && !value) {
      _rule.message = `请输入${name}`;
      return Promise.reject();
    }
    if (restriction.min && value && value.length < restriction.min) {
      _rule.message = `请输入至少${restriction?.min}个字`;
      return Promise.reject();
    }
    if (restriction.max && value && value.length > restriction.max) {
      _rule.message = `请输入最多${restriction?.max}个字`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  // Textarea的自定义验证
  const checkTextareaRule = (_rule: any, value: any) => {
    if (realRequired && !value) {
      _rule.message = `请输入${name}`;
      return Promise.reject();
    }
    if (restriction?.min && value && value.length < restriction.min) {
      _rule.message = `请输入至少${restriction?.min}个字`;
      return Promise.reject();
    }
    if (restriction.max && value && value.length > restriction.max) {
      _rule.message = `请输入最多${restriction?.max}个字`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  // DynamicInputNumber的自定义校验
  const checkNumberInputRule = (_rule: any, value: any) => {
    if (typeof value === 'object') {
      if (isUndef(value.value) && realRequired) {
        _rule.message = `请输入${name}`;
        return Promise.reject();
      }
      if (!!value.value && isObject(restriction.range)) {
        if (restriction.range.minValue > value.value || restriction.range.maxValue < value.value) {
          _rule.message = `请输入${restriction.range?.minValue}-${restriction.range?.maxValue}之间的数值`;
          return Promise.reject();
        }
      }
    }
    return Promise.resolve();
  };

  // DynamicTreeSelect的自定义验证
  const checkTreeRule = (_rule: any, value: any) => {
    if (realRequired && (!value || !value.optionList || !value.optionList.length)) {
      _rule.message = `请选择${name}`;
      return Promise.reject();
    }
    return Promise.resolve();
  };

  const renderFormItem = () => {
    switch (controlType) {
      case ControlType.SINGLE_RADIO.value:
        const { propertyOptionList = [] } = prop;
        return (
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ margin: 0 }}
            name={valuePropName}
            required={realRequired}
            rules={[{ validator: checkRadioRule }]}
          >
            {propertyOptionList?.length <= 4
              ? <DynamicRadio prop={prop} />
              : <DynamicSelect
                propertyOptionList={propertyOptionList}
                {...prop}
              />}
          </Form.Item>
        );
      case ControlType.CHECK_BOX.value:
        return (
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ margin: 0 }}
            name={valuePropName}
            required={realRequired}
            rules={[{ validator: checkBoxRule }]}
          >
            <DynamicCheckbox prop={prop} restriction={restriction} />
          </Form.Item>
        );
      case ControlType.INPUT.value:
        return (
          <FormInput
            // config={{ disabled: disabled }}
            name={valuePropName}
            placeholder={`请输入${name}`}
            rules={[{ validator: checkInputRule }]}
            formItemConfig={{ required: realRequired, wrapperCol: { span: 24 }, style: { margin: 0 } }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
            config={{ showCount: !!restriction?.max, maxLength: restriction?.max || null }}
          />
        );
      case ControlType.TEXT_AREA.value:
        return (
          <FormTextArea
            name={valuePropName}
            placeholder={`请输入${name}`}
            rules={[{ validator: checkTextareaRule }]}
            formItemConfig={{ required: realRequired, wrapperCol: { span: 24 } }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
            config={{ showCount: true, maxLength: restriction?.max || null }}
          />
        );
      case ControlType.INPUT_NUMBER.value:
        return (
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ margin: 0 }}
            name={valuePropName}
            required={realRequired}
            rules={[{ validator: checkNumberInputRule }]
            }>
            <DynamicInputNumber restriction={restriction} />
          </Form.Item>
        );
      case ControlType.TIME.value:
        return (
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ margin: 0 }}
            name={valuePropName}
            rules={[{ required: realRequired, message: `请选择${name}` }]}
          >
            <DynamicTime prop={prop} />
          </Form.Item>
        );
      case ControlType.AREA.value:
        return (
          <Form.Item
            wrapperCol={{ span: 24 }}
            style={{ margin: 0 }}
            name={valuePropName}
            rules={[{ required: true, message: '请选择所属城市' }]}>
            <CitySelect placeholder='选择所属城市' fieldValue='id' multiple={false} />
          </Form.Item>
        );
      case ControlType.TREE_SELECT.value:
        return (<Form.Item
          wrapperCol={{ span: 24 }}
          style={{ margin: 0 }}
          name={valuePropName}
          required={realRequired}
          rules={[{ validator: checkTreeRule }]}>
          <DynamicTreeSelect restriction={restriction} />
        </Form.Item>);
      default:
        return null;
    }
  };

  return <>{renderFormItem()}</>;
};

export default SubFormDynamicComponent;
