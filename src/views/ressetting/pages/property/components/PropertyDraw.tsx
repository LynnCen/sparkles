import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import FormTextArea from '@/common/components/Form/FormTextArea';
import { ControlType } from '@/common/enums/control';
import { useMethods } from '@lhb/hook';
import { post } from '@/common/request';
import { Button, Drawer, Form, message, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { PropertyDrawProps } from '../ts-config';
import DynamicControl from './DynamicControl';
import { debounce } from '@lhb/func';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const controlTypeOptions = Object.values(ControlType).map((item) => ({ label: item.name, value: item.value }));
console.log(controlTypeOptions, 'controlTypeOptions', ControlType);
const PropertyDraw: React.FC<PropertyDrawProps> = ({ onSearch, propertyDrawInfo, setPropertyDrawInfo }) => {
  const [form] = Form.useForm();
  const [controlType, setControlType] = useState<number>(
    propertyDrawInfo.controlType ? propertyDrawInfo.controlType : ControlType.SINGLE_RADIO.value
  );

  const [propertyClassifications, setPropertyClassifications] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { parseTitle, onCancel, onFinish } = useMethods({
    onCancel() {
      setPropertyDrawInfo({ ...propertyDrawInfo, visible: false });
      form.resetFields();
    },
    parseTitle() {
      return propertyDrawInfo.id ? '编辑属性' : '新增属性';
    },
    onFinish() {
      form.validateFields().then((values: any) => {
        const isInputNumber = ControlType.INPUT_NUMBER.value === controlType;
        const obj = values[ControlType.getByValue(controlType).csName];
        const { decimals, ...restValues } = obj || {};
        // 数字输入属性时结构调整
        const restriction = isInputNumber ? { ...restValues, precision: { decimals } } : obj;
        const params = {
          ...(propertyDrawInfo.id && { id: propertyDrawInfo.id }),
          propertyClassificationId: values.propertyClassificationId,
          name: values.name,
          identification: values.identification,
          duplicate: values.duplicate,
          controlType: controlType,
          superposition: 1,
          required: values.required,
          remark: values.remark,
          propertyOptionList: values.propertyOptionList,
          restriction: JSON.stringify(restriction),
        };
        const url = propertyDrawInfo.id ? '/property/update' : '/property/create';
        post(url, params, true).then(() => {
          message.success(`${propertyDrawInfo.id ? '修改' : '新建'}成功`);
          onSearch();
          onCancel();
        });
      }).catch(e => {

        console.log(e, '6666');

      });
    },
  });

  // 获取属性下来列表
  const getPropertyClassificationGrops = async (keyword?: string) => {
    setLoading(true);
    const options = await post('/propertyClassification/group/list', { keyword });
    setPropertyClassifications(options);
    setLoading(false);
  };

  // 搜索
  const onPropertyClassificationSearch = debounce((keyword: string) => {
    setSearch(keyword);
    if (!loading) {
      getPropertyClassificationGrops(keyword);
    }
  }, 300);

  useEffect(() => {
    if (propertyDrawInfo.visible) {
      getPropertyClassificationGrops(search);
    }
  }, [propertyDrawInfo.visible, search]);

  useEffect(() => {
    if (propertyDrawInfo.visible && propertyDrawInfo.id) {
      if (propertyDrawInfo.restriction && propertyDrawInfo.restriction !== '{}') {
        const csName = ControlType.getByValue(propertyDrawInfo.controlType).csName;
        const isInputNumber = ControlType.INPUT_NUMBER.value === propertyDrawInfo.controlType;
        if (isInputNumber) {
          // 数字输入属性时结构调整
          const obj = JSON.parse(propertyDrawInfo.restriction);
          const { precision, ...restValues } = obj || {};
          propertyDrawInfo[csName] = { ...restValues, decimals: precision && precision.decimals };
        } else {
          propertyDrawInfo[csName] = JSON.parse(propertyDrawInfo.restriction);
        }
      }
      form.setFieldsValue(propertyDrawInfo);
      setControlType(propertyDrawInfo.controlType ? propertyDrawInfo.controlType : ControlType.SINGLE_RADIO.value);
    } else {
      form.setFieldsValue({ controlType: ControlType.SINGLE_RADIO.value, propertyClassificationId: propertyDrawInfo.propertyClassificationId });
      setControlType(ControlType.SINGLE_RADIO.value);
    }
    // eslint-disable-next-line
  }, [propertyDrawInfo.visible]);

  return (
    <Drawer
      title={parseTitle()}
      maskClosable={false}
      size='large'
      onClose={onCancel}
      forceRender
      open={propertyDrawInfo.visible}
    >
      <Form {...layout} form={form}>
        <FormSelect
          label='所属分类'
          name='propertyClassificationId'
          placeholder='请选择所属分类'
          options={propertyClassifications}
          config={{ fieldNames: {
            label: 'name',
            value: 'id'
          },
          showSearch: true,
          notFoundContent: loading ? <Spin size='small' /> : undefined,
          onSearch: onPropertyClassificationSearch,
          filterOption: false,
          }}
        />
        <FormInput
          label='属性名称'
          name='name'
          placeholder='请输入属性名称'
          rules={[{ required: true, message: '请输入属性名称' }]}
        />
        <FormInput
          label='属性标识'
          name='identification'
          placeholder='请输入属性标识'
          config={{
            disabled: !!propertyDrawInfo.id
          }}
          rules={[{ required: true, message: '请输入属性标识' }]}
        />

        <FormSelect
          label='控件类型'
          name='controlType'
          placeholder='请选择'
          options={controlTypeOptions}
          rules={[{ required: true, message: '请选择控件类型' }]}
          config={{
            onChange: (value) => {
              setControlType(value);
            },
            disabled: !!propertyDrawInfo.id
          }}
        />

        <DynamicControl controlType={controlType} />
        {/* <FormRadio
          label='是否可以叠加'
          name='superposition'
          formItemConfig={{
            style: { width: '100%' },
          }}
          initialValue={1}
          rules={[{ required: true, message: '请选择是否可以叠加' }]}
          config={{
            options: [
              { value: 1, label: '叠加' },
              { value: 2, label: '无需叠加' },
            ],
          }}
        /> */}
        {/* <FormSelect
          label='所属分类'
          name='propertyClassificationId'
          placeholder='请选择所属分类'
          rules={[{ required: false, message: '请选择所属分类' }]}
          options={[]}
        /> */}
        <FormTextArea label='备注' name='remark' />
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Space>
            <Button onClick={onFinish} type='primary'>
              确定
            </Button>
            <Button onClick={onCancel} type='primary'>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default PropertyDraw;
