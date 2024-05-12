// import FormCheckbox from '@/common/components/Form/FormCheckbox';
import FormInput from '@/common/components/Form/FormInput';
// import FormRadio from '@/common/components/Form/FormRadio';
// import FormRadio from '@/common/components/Form/FormRadio';
import FormTextArea from '@/common/components/Form/FormTextArea';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { ControlType } from '@/common/enums/control';
import PolygonMap from '@/views/ressetting/pages/circle/components/PolygonMap';
import { isObject, isUndef } from '@lhb/func';
import { Form } from 'antd';
import { FC } from 'react';
import DynamicAddress from './DynamicAddress';
import DynamicBusinessCircle from './DynamicBusinessCircle';
import DynamicChannelDesc from './DynamicChannelDesc';
import DynamicCheckbox from './DynamicCheckbox';
import DynamicFloorDesc from './DynamicFloorDesc';
import DynamicFloorInfo from './DynamicFloorInfo';
import DynamicRadio from './DynamicRadio';
import DynamicRatio from './DynamicRatio';
import DynamicSpecLW from './DynamicSpecLW';
import DynamicTime from './DynamicTime';
import DynamicUpload from './DynamicUpload';
import FormEditor from '@/common/components/Form/FormEditor';
import DynamicInputNumber from '@/views/resmng/pages/detail/components/DynamicInputNumber';
import DynamicSelect from '@/views/resmng/pages/detail/components/DynamicSelect';
import DynamicTreeSelect from '@/views/resmng/pages/detail/components/DynamicTreeSelect';

const DynamicComponent: FC<any> = ({ prop, ignoreRequired = false, form, categoryName }) => {
  const { controlType } = prop;
  const propertyId = String(prop.propertyId);
  const anotherName = prop.anotherName ? prop.anotherName : prop.name;
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
    if (realRequired && !value.length) {
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
    if (realRequired && !value.length) {
      _rule.message = `请选择${name}`;
      return Promise.reject();
    }
    if (value.length < restriction.min || value.length > restriction.max) {
      _rule.message = `最少选择${restriction.min}项, 最多选择${restriction.max}项`;
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
            config={{
              style: { width: '400px' },
            }}
            rules={[{ validator: checkInputRule }]}
            formItemConfig={{ required: realRequired }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
          />
        );
      case ControlType.TEXT_AREA.value:
        return (
          <FormTextArea
            config={{
              style: { width: '400px' },
            }}
            name={['propertyList', propertyId]}
            label={anotherName}
            rules={[{ validator: checkTextareaRule }]}
            formItemConfig={{ required: realRequired }}
            {...(restriction.placeholder && { placeholder: restriction.placeholder })}
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
            <DynamicInputNumber restriction={restriction}/>
          </Form.Item>
        );
      case ControlType.MAP_POLYGON.value:
        return (
          <Form.Item name={['propertyList', propertyId]} wrapperCol={{ offset: 4 }} noStyle>
            <PolygonMap display='' />
          </Form.Item>
        );
      case ControlType.TIME.value:
        return (
          <Form.Item
            name={['propertyList', propertyId]}
            label={anotherName}
            rules={[{ required: ignoreRequired ? false : required }]}
          >
            <DynamicTime prop={prop} />
          </Form.Item>
        );
      case ControlType.ADDRESS.value:
        return (
          <Form.Item label={anotherName} name={['propertyList', propertyId]} rules={[{
            required: ignoreRequired ? false : required, message: '请输入详细地址', validator(_, value) {
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
              selectRules={[{ required: ignoreRequired ? false : required, message: '请输入详细地址' }]}
            />
          </Form.Item>
        );
      case ControlType.CHANNEL_DESC.value:
        return (
          <Form.Item label='通道描述' name={['propertyList', propertyId]}>
            <DynamicChannelDesc value={prop} />
          </Form.Item>
        );
      case ControlType.FLOOR_INFO.value:
        return (
          <Form.Item label='楼层信息' name={['propertyList', propertyId]}>
            <DynamicFloorInfo value={prop} />
          </Form.Item>
        );
      case ControlType.FLOOR_DESC.value:
        return (
          <Form.Item label='楼层描述' name={['propertyList', propertyId]}>
            <DynamicFloorDesc value={prop} />
          </Form.Item>
        );
      case ControlType.AREA.value:
        return (
          <FormProvinceList
            label='所属城市'
            name={['propertyList', propertyId]}
            placeholder='选择所属城市'
            rules={[{ required: true, message: '请选择所属城市' }]}
            config={{
              style: { width: '400px' },
              showSearch: true
            }}
          />
        );
      case ControlType.SPEC_L_W.value:
        return (
          <Form.Item
            label='规格'
            rules={[{
              validator(_: any, value) {
                const { l, w } = value?.[0] || {};
                if (l === undefined) {
                  return Promise.reject(new Error('长度必填'));
                }
                if (w === undefined) {
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
            rules={[{ required: ignoreRequired ? false : required }]}
          >
            <DynamicBusinessCircle value={prop} />
          </Form.Item>
        );
      case ControlType.RES_TYPE_PLACE.value:
        return <Form.Item label='场地类型'>{decodeURI(categoryName)}</Form.Item>;
      case ControlType.RES_TYPE_SPOT.value:
        return <Form.Item label='点位类型'>{decodeURI(categoryName)}</Form.Item>;
      case ControlType.TREE_SELECT.value:
        return <Form.Item
          label={anotherName}
          name={['propertyList', propertyId]}
          required={realRequired}
          rules={[{ validator: checkTreeRule }]}>
          <DynamicTreeSelect restriction={restriction}/>
        </Form.Item>;
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
            <DynamicInputNumber restriction={restriction}/>
          </Form.Item>
        );
      default:
        return <></>;
    }
  };

  return <>{renderFormItem()}</>;
};

export default DynamicComponent;
