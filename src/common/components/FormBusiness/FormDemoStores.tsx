/**
 * 表单项用户列表
 */
import React from 'react';
import { Form } from 'antd';
// import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { isFunction } from '@lhb/func';
import DemoStores from '../Select/DemoStores';

export interface FormStoresProps {
  form?: any;
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: any;
  onChange?: Function;
  addAllStores?: boolean; // 添加所有门店
  defaultCheck?: boolean; // 默认选中第一个
  maxSelect?: number; // 多选时，最大可选择数，没设置时忽略
  change?: (val: number | string) => void;
}

const FormStores: React.FC<FormStoresProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  formItemConfig = {},
  config = {},
  addAllStores = false,
  defaultCheck = false,
  maxSelect = 0,
  change
}) => {
  const onChange = (val: any) => {
    // 如果添加所有门店且form存在
    if (addAllStores && form) {
      if (!val) return;
      const targetIndex = val.findIndex((item: number) => item === -1);
      const lastCheck = val[val.length - 1];
      let checkList: number[] = val;
      // 最后一个选择的是全部门店
      if (lastCheck === -1) {
        checkList = [-1];
        // 前面选过全部门店之后再选具体某个门店，过滤掉全部门店
      } else if (lastCheck !== -1 && targetIndex !== -1) {
        checkList = val.filter((item: number) => item !== -1);
      }
      form.setFieldsValue({ [name]: checkList });
    } else {
      // 限制了最大可选数时，取前几项
      form &&
        form.setFieldsValue({
          [name]: maxSelect && Array.isArray(val) ? val.filter((item:any, idx: number) => (idx <= maxSelect - 1)) : val
        });
    }
    change && isFunction(change) && change(val);
  };

  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
      <DemoStores
        {...config}
        addAllStores={addAllStores}
        defaultCheck={defaultCheck}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default FormStores;
