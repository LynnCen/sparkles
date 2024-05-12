/**
 * 表单项用户列表
 * warning 待废弃，除了 location 组，其他都使用 src/common/components/FormBusiness/FormResourceBrand.tsx
 */
import { FC } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { FuzzyProps } from '../Select/Fuzzy';
import { deepCopy } from '@lhb/func';
import { DefaultListData } from '@/common/components/FormBusiness/ts-config';
import Brand from '@/common/components/Select/Brand';

export interface FormBrandProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps & Omit<FuzzyProps, 'loadData'> & DefaultListData;
  finallyData?: Function; // 取出获取到数据
  onChange?: Function;
  isAddable?: boolean;
  brandRef?: any; // ref实例
}

const FormBrand: FC<FormBrandProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `请选择${label}`,
  allowClear = false,
  isAddable,
  form,
  extraParams = {},
  formItemConfig = {},
  config = {},
  finallyData,
  onChange,
  brandRef
}) => {
  // 添加品牌后的帮助选择
  const addAfterChecked = (id: number | string) => {
    if (!form) {
      throw new Error(`未获取到FormInstance`);
    }
    const { mode } = config;
    const brandCurVal = form.getFieldValue(name); // 获取当前品牌选中值，未选中时是 undefined
    let futureVal = deepCopy(brandCurVal); // 拷贝
    if (mode === 'multiple') {
      if (brandCurVal && brandCurVal.includes(id)) return;
      futureVal ? futureVal.push(id) : (futureVal = [id]);
    } else {
      futureVal = id;
    }
    form.setFieldsValue({
      [name]: futureVal
    });
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <Brand
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        isAddable={isAddable}
        brandRef={brandRef}
        assignmentHandle={(id) => addAfterChecked(id)}
        {...config}/>
    </Form.Item>
  );
};

export default FormBrand;

