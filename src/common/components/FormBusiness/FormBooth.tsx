/**
 * 展位列表
 */
import { FC } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { FuzzyProps } from '../Select/Fuzzy';
import { deepCopy } from '@lhb/func';
import { BoothSearchItem } from '@/views/tenant/pages/detail/ts-config';
import Booth from '@/common/components/Select/Booth';

interface DefaultListData {
  setListData?: BoothSearchItem[]
}

export interface FormBoothProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SelectProps & Omit<FuzzyProps, 'loadData'> & DefaultListData;
  finallyData?: Function; // 取出获取到数据
  onChange?: Function;
  isAddable?: boolean;
}

const FormBooth: FC<FormBoothProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder,
  allowClear = false,
  isAddable,
  form,
  extraParams = {},
  formItemConfig = {},
  config = {},
  finallyData,
  onChange
}) => {
  // 添加展位后的帮助选择
  const addAfterChecked = (id: number | string) => {
    if (!form) {
      throw new Error(`未获取到FormInstance`);
    }
    const { mode } = config;
    const boothCurVal = form.getFieldValue(name); // 获取当前展位选中值，未选中时是 undefined
    let futureVal = deepCopy(boothCurVal); // 拷贝
    if (mode === 'multiple') {
      if (boothCurVal && boothCurVal.includes(id)) return;
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
      <Booth
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={finallyData}
        isAddable={isAddable}
        assignmentHandle={(id) => addAfterChecked(id)}
        {...config}/>
    </Form.Item>
  );
};

export default FormBooth;


