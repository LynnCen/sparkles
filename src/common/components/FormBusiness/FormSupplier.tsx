// 供应商列表
import { FC, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import Supplier from 'src/common/components/Select/Supplier';

interface SupplierConfig extends SelectProps {
  immediateOnce?: boolean;
}
export interface SupplierProps {
  // form: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SupplierConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  channel?: string;
  formRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
}

const FormSupplier: FC<SupplierProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  // form,
  placeholder = `输入${label}关键词，并选择`,
  allowClear = true,
  extraParams = {},
  formItemConfig = {},
  config = { suffixIcon: <SearchOutlined className='fs-14' /> },
  changeHandle,
  defaultOptions,
  channel,
  formRef,
  // finallyData,
}) => {
  let ref: any = useRef();
  if (formRef) {
    ref = formRef;
  }
  const onChange = (val: any, option: any) => {
    // form.setFieldsValue({
    //   [name as string]: val,
    // });
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
      <Supplier
        {...config}
        channel={channel}
        onRef={ref}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}/>
    </Form.Item>
  );
};

export default FormSupplier;

