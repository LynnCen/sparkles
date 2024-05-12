import { FC, useEffect, useState } from 'react';
import { Cascader, Form } from 'antd';
// import { CascaderProps } from 'antd/lib/cascader';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { industryTree } from '@/common/api/flow';

export interface FormCascaderIndustryProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  config?: any;
  finallyData?: Function; // 取出获取到数据
  onChange?: Function;
}

const FormCascaderIndustry: FC<FormCascaderIndustryProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  finallyData,
  onChange
}) => {
  const [industryOptions, setIndustryOptions] = useState<any[]>([]);

  const industriesList = async () => {
    const data = await industryTree();
    if (Array.isArray(data)) {
      finallyData && finallyData(data);
      setIndustryOptions(data);
    }
  };

  useEffect(() => {
    industriesList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        {...formItemConfig}>
        <Cascader
          allowClear={allowClear}
          placeholder={placeholder}
          options={industryOptions}
          fieldNames={{
            label: 'name',
            value: 'id'
          }}
          onChange={onChange}
          {...config}/>
      </Form.Item>
    </>
  );
};

export default FormCascaderIndustry;
