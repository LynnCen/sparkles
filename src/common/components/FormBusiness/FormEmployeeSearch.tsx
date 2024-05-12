/**
 * @description  员工搜索表单项
 */
import { Form, SelectProps } from 'antd';
import { FC, useRef } from 'react';
import { DefaultFormItemProps } from '../Form/ts-config';
import EmployeeSelect from '../Select/EmployeeSelect';

interface FormEmployeeSearchProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  onChange?: Function; // 映射select的onChange
  formRef?: any; // ref示例
  selectConfig?: SelectProps;
}

const FormEmployeeSearch:FC<FormEmployeeSearchProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `输入${label}关键词，并选择`,
  allowClear = true,
  extraParams = {},
  formItemConfig = {},
  onChange,
  formRef,
  selectConfig
}) => {
  let ref: any = useRef();
  if (formRef) {
    ref = formRef;
  }

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}
    >
      <EmployeeSelect
        onRef={ref}
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        {...selectConfig}
      />
    </Form.Item>
  );
};

export default FormEmployeeSearch;
