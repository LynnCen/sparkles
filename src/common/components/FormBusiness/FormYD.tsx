/**
 * 云盯三方门店列表
 */
import { FC } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { FuzzyProps } from '../Select/Fuzzy';
import { DefaultListData } from '@/common/components/FormBusiness/ts-config';
import YD from '@/common/components/Select/YD';

export interface FormYDProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps & Omit<FuzzyProps, 'loadData'> & DefaultListData;
  finallyData?: Function; // 取出获取到数据
  onChange?: Function;
  ydRef?: any; // ref实例
}

const FormYD: FC<FormYDProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `请选择${label}`,
  allowClear = false,
  extraParams = {},
  formItemConfig = {},
  config = {},
  finallyData,
  onChange,
  ydRef
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <YD
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        ref={ydRef}
        {...config}/>
    </Form.Item>
  );
};

export default FormYD;

