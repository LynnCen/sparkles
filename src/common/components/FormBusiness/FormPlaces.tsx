/**
 * 表单项场地列表
 */
import React, { ReactNode } from 'react';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import Places from '../Select/Places';
import { Form } from 'antd';

export interface FormPlacesProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps;
  onChange?: Function;
  finallyData?: Function;
  changeHandle?: Function; // 映射select的onChange
  enableNotFoundNode?: boolean;
  notFoundNode?: ReactNode;
  keyword?: string;
  refreshKeyword?: any
  immediateOnce?: boolean;
  fuzzyRef?: any;
}

const FormPlaces: React.FC<FormPlacesProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder = `请选择${label || ''}`,
  allowClear = true,
  formItemConfig = {},
  config = {},
  changeHandle,
  finallyData,
  enableNotFoundNode = false,
  notFoundNode,
  keyword,
  refreshKeyword,
  immediateOnce,
  fuzzyRef
}) => {
  const onChange = (val: any, option: any) => {
    changeHandle && changeHandle(val, option);
    form &&
      form.setFieldsValue({
        [name]: val,
      });
  };

  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <Places
        {...config}
        fuzzyRef={fuzzyRef}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        enableNotFoundNode={enableNotFoundNode}
        notFoundNode={notFoundNode}
        keyword={keyword}
        refreshKeyword={refreshKeyword}
        immediateOnce={immediateOnce}
      />
    </Form.Item>
  );
};

export default FormPlaces;
