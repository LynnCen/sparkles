import { FC, ReactNode } from 'react';
import { NamePath } from 'antd/lib/form/interface';
import { Form, FormItemProps } from 'antd';
import MultipleDatePicker from './MultipleDatePicker';
import styles from './index.module.less';

export interface DefaultFormItemProps {
  /**
   * @description 字段名，支持数组
   */
  name?: NamePath | any;
  /**
   * @description label 标签的文本
   */
  label?: ReactNode;
  /**
   * @description Form.Item中rule属性设置，具体请参考 https://ant.design/components/form-cn/#Rule
   */
  rules?: any[];
  /**
   * @description Form.Item的属性设置，具体请参考 https://ant.design/components/form-cn/#Form.Item
   */
  formItemConfig?: FormItemProps; // Form.Item的其他入参
}

export interface FormMultipleDatePickerProps extends DefaultFormItemProps {
  /**
   * @description MultipleDatePicker配置，详见下方 config 配置
   */
  config?: any;
  /**
   * @description MultipleDatePicker-select配置
   */
  selectProps?: any;
}

export interface withNoUse {
  /**
   * @description 透传给MultipleDatePicker，详情见下方 config 配置
   */
  placeholder?: string;
  /**
   * @description 透传给MultipleDatePicker，详情见下方 config 配置
   */
  onChange?: Function;
}
const FormMultipleDatePicker: FC<FormMultipleDatePickerProps & withNoUse> = ({
  label,
  name,
  rules,
  placeholder,
  formItemConfig = {},
  config = {},
  onChange,
  selectProps,
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules} valuePropName='selectedDate' className={styles.formMultipleDatePicker} {
      ...formItemConfig
    }>
      <MultipleDatePicker
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e)}
        selectProps={selectProps}
        {...config}
      />
    </Form.Item>
  );
};

export default FormMultipleDatePicker;
