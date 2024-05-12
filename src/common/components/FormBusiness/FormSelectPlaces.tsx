/**
 * @Description 表单项场地列表 踩点宝中可快速创建的场地
 */
import React, { ReactNode } from 'react';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { Form } from 'antd';
import SelectPlaces from '../Select/SelectPlaces';

export interface FormSelectPlacesProps {
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
  channel: string;
}

const FormSelectPlaces: React.FC<FormSelectPlacesProps & DefaultFormItemProps> = ({
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
  extraParams,
  refreshKeyword,
  immediateOnce,
  fuzzyRef,
  channel,
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
      <SelectPlaces
        {...config}
        fuzzyRef={fuzzyRef}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        enableNotFoundNode={enableNotFoundNode}
        notFoundNode={notFoundNode}
        keyword={keyword}
        extraParams={extraParams}
        refreshKeyword={refreshKeyword}
        immediateOnce={immediateOnce}
        channel={channel}
      />
    </Form.Item>
  );
};

export default FormSelectPlaces;
