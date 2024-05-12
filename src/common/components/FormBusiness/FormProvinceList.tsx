/**
 * 省市区/省市
 * Cascader作为单独组件放到Form.Item内部，需接收value和onChange事件，才能与form联动
 *
 */
import React, { memo } from 'react';
import { Form } from 'antd';
import { CascaderProps } from 'antd/lib/cascader/index';
import ProvinceList from '@/common/components/ProvinceList';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';

export interface FormProvinceProps {
  placeholder?: string;
  config?: CascaderProps<any>;
  onChange?: Function;
  type?: number; // 默认为1： 省市区 2： 省市
}

const FormProvinceList: React.FC<FormProvinceProps & DefaultFormItemProps> = memo(
  ({ name, label, rules, placeholder = '请选择省市区', type = 1, formItemConfig = {}, config = {} }) => {
    return (
      <Form.Item name={name} label={label} rules={rules} {...formItemConfig}>
        <ProvinceList {...config} placeholder={placeholder} type={type} />
      </Form.Item>
    );
  }
);

export default FormProvinceList;
