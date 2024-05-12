// 租户模板列表， copy from FormBrandResource
import { FC, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import TenantTemplate from './TenantTemplate';

interface TenantTemplateConfig extends SelectProps {
  immediateOnce?: boolean;
}
export interface TenantTemplateProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: TenantTemplateConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  channel?: string;
  formRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
}

const FormTenantTemplate: FC<TenantTemplateProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `输入${label}关键词，并选择`,
  allowClear = true,
  extraParams = {},
  formItemConfig = {},
  config = { suffixIcon: <SearchOutlined className='fs-14' /> },
  changeHandle,
  defaultOptions,
  formRef,
  // finallyData,
}) => {
  let ref: any = useRef();
  if (formRef) {
    ref = formRef;
  }
  const onChange = (val: any, option: any) => {
    if (changeHandle) {
      const data = ref.current.getData();
      const originOption = data.find(item => {
        return item.id === val;
      });
      changeHandle(val, option, originOption);
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <TenantTemplate
        {...config}
        onRef={ref}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}/>
    </Form.Item>
  );
};

export default FormTenantTemplate;

