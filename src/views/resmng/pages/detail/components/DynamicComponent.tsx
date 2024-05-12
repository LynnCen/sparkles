
// import FormProvinceList from '@/components/FormBusiness/FormProvinceList';
import { ControlType } from '@/common/enums/control';
import { Form, Result, Typography } from 'antd';
import { FC } from 'react';
import { isObject, isUndef } from '@lhb/func';
import DynamicAddress from './DynamicAddress';
import DynamicBusinessCircle from './DynamicBusinessCircle';
import DynamicChannelDesc from './DynamicChannelDesc';
import DynamicCheckbox from './DynamicCheckbox';
import DynamicFloorDesc from './DynamicFloorDesc';
import DynamicFloorInfo from './DynamicFloorInfo';
import DynamicRadio from './DynamicRadio';
import DynamicRatio from './DynamicRatio';
import DynamicSelect from './DynamicSelect';
import DynamicSpecLW from './DynamicSpecLW';
import DynamicTime from './DynamicTime';
import DynamicInputNumber from './DynamicInputNumber';
import DynamicTreeSelect from './DynamicTreeSelect';
import FormEditor from '@/common/components/Form/FormEditor';
import CitySelect from '@/common/business/CitySelect';
import FormInput from '@/common/components/Form/FormInput';
import FormTextArea from '@/common/components/Form/FormTextArea';
import PolygonMap from '@/views/ressetting/pages/circle/components/PolygonMap';
import DynamicUpload from './DynamicUpload';
import DynamicSubForm from './DynamicSubForm';

const { Text } = Typography;

const renderLabel = (text: string) => {
  return (
    <Text ellipsis={{ tooltip: text }} style={{ whiteSpace: 'normal' }}>
      <span style={{ color: '#768098' }}>
        {text}
      </span>
    </Text>
  );
};

const DynamicComponent: FC<any> = ({ prop, ignoreRequired = false, hideLabel = false, form }) => {
  const { controlType } = prop;
  const propertyId = String(prop.propertyId);
  const name = prop.anotherName ? prop.anotherName : prop.name ? prop.name : prop.propertyName;
  const anotherName = hideLabel ? <></> : renderLabel(name);
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

  // DynamicUpload的自定义校验
  const checkUploadRule = (_rule: any, value: any) => {
    if (realRequired && !value?.length) {
      return Promise.reject();
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
            name={['propertyList', propertyId]}
            label={anotherName}
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
            name={['propertyList', propertyId]}
            label={anotherName}
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
            name={['propertyList', propertyId]}
            label={anotherName}
            placeholder={`请输入${name}`}
            rules={[{ validator: checkInputRule }]}
            formItemConfig={{ required: realRequired }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
            config={{ showCount: !!restriction?.max, maxLength: restriction?.max || null }}
          />
        );
      case ControlType.TEXT_AREA.value:
        return (
          <FormTextArea
            name={['propertyList', propertyId]}
            label={anotherName}
            placeholder={`请输入${name}`}
            rules={[{ validator: checkTextareaRule }]}
            formItemConfig={{ required: realRequired }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
            config={{ showCount: true, maxLength: restriction?.max || null }}
          />
        );
      case ControlType.UPLOAD.value:
        const help = `请上传${restriction?.accept?.join('/')}，最多${restriction.maxCount || 1}个文件，最多${restriction.size || 20}M`; // 使用组件内部文件数、文件大小的默认值
        return (
          <Form.Item required={realRequired} rules={[{ validator: checkUploadRule }]} help={help} name={['propertyList', propertyId]} label={anotherName}>
            <DynamicUpload restriction={restriction} />
          </Form.Item>
        );
      case ControlType.RATIO.value:
        return (
          <DynamicRatio
            value={{
              name: 'propertyList',
              label: anotherName,
              propertyId: propertyId,
              propertyOptionList: prop.propertyOptionList,
            }}
          />
        );
      case ControlType.INPUT_NUMBER.value:
        return (
          <Form.Item
            name={['propertyList', propertyId]}
            label={anotherName}
            required={realRequired}
            rules={[{ validator: checkNumberInputRule }]
            }>
            <DynamicInputNumber restriction={restriction} />
          </Form.Item>
        );
      case ControlType.MAP_POLYGON.value:
        return (
          <Form.Item name={['propertyList', propertyId]} wrapperCol={{ offset: 4 }} noStyle>
            <PolygonMap display='' anotherName={anotherName} />
          </Form.Item>
        );
      case ControlType.TIME.value:
        return (
          <Form.Item
            name={['propertyList', propertyId]}
            label={anotherName}
            rules={[{ required: realRequired, message: `请选择${name}` }]}
          >
            <DynamicTime prop={prop} />
          </Form.Item>
        );
      case ControlType.ADDRESS.value:
        return (
          <Form.Item label={anotherName} name={['propertyList', propertyId]} rules={[{
            required: realRequired, message: '请输入详细地址', validator(_, value) {
              if (!ignoreRequired) {
                if (value.address) {
                  return Promise.resolve();
                }
                return Promise.reject('详细地址必填');
              }
              return Promise.resolve();
            },
          }]}>
            <DynamicAddress label=''
              value={prop}
              selectRules={[{ required: realRequired, message: '请输入详细地址' }]}
            />
          </Form.Item>
        );
      case ControlType.CHANNEL_DESC.value:
        return (
          <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 0 }} name={['propertyList', propertyId]}>
            <DynamicChannelDesc value={prop} title={anotherName} />
          </Form.Item>
        );
      case ControlType.FLOOR_INFO.value:
        return (
          <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 0 }} name={['propertyList', propertyId]} >
            <DynamicFloorInfo value={prop} label={anotherName} />
          </Form.Item>
        );
      case ControlType.FLOOR_DESC.value:
        return (
          <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 0 }} name={['propertyList', propertyId]}>
            <DynamicFloorDesc value={prop} label={anotherName} />
          </Form.Item>
        );
      case ControlType.AREA.value:
        return (
          <Form.Item label={anotherName}
            name={['propertyList', propertyId]}
            rules={[{ required: true, message: '请选择所属城市' }]}>
            <CitySelect placeholder='选择所属城市' fieldValue='id' multiple={false} />
          </Form.Item>
        );
      case ControlType.SPEC_L_W.value:
        return (
          <Form.Item
            label={anotherName}
            rules={[{
              validator(_: any, value) {
                const { l, w } = value?.[0] || {};
                if (!l) {
                  return Promise.reject(new Error('长度必填'));
                }
                if (!w) {
                  return Promise.reject(new Error('宽度必填'));
                }
                return Promise.resolve();
              }
            }, { required: true, message: '规格必填' }]}

            name={['propertyList', propertyId]}
          >
            <DynamicSpecLW propertyId={propertyId} form={form} />
          </Form.Item>);
      case ControlType.BUSINESS_CIRCLE.value:
        return (
          <Form.Item
            name={['propertyList', propertyId]}
            label={anotherName}
            rules={[{ required: realRequired, message: `请选择${name}` }]}
          >
            <DynamicBusinessCircle value={prop} />
          </Form.Item>
        );
      case ControlType.TREE_SELECT.value:
        return (<Form.Item
          label={anotherName}
          name={['propertyList', propertyId]}
          required={realRequired}
          rules={[{ validator: checkTreeRule }]}>
          <DynamicTreeSelect restriction={restriction} />
        </Form.Item>);
      case ControlType.RICH_TEXT.value:
        return (
          <FormEditor
            name={['propertyList', propertyId]}
            label={anotherName}
            placeholder={`请输入${name}`}
            rules={[{ required: realRequired, message: `请输入${name}` }]}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
          />
        );
      case ControlType.COMPUTER.value:
        return (
          <Form.Item
            name={['propertyList', propertyId]}
            label={anotherName}
            required={realRequired}
            rules={[{ validator: checkNumberInputRule }]
            }>
            <DynamicInputNumber restriction={restriction} />
          </Form.Item>
        );
      case ControlType.SUB_FORM.value:
        if (!prop.formConfigList || !prop.formConfigList.length) {
          return <><Result
            status='warning'
            subTitle='请至模板管理配置子表单'
          /></>;
        }
        return <DynamicSubForm
          form={form}
          valuePropName={['propertyList', propertyId]}
          restriction={restriction}
          label={anotherName}
          formConfigList={prop.formConfigList}
        />;
      default:
        return null;
    }
  };

  return <>{renderFormItem()}</>;
};

export default DynamicComponent;
