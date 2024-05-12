import { FC, ReactNode } from 'react';
import { Form, FormItemProps, Space } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import styles from '../index.module.less';
import cs from 'classnames';

export interface FormMergeRulesProps {
  /**
   * @description label 标签的文本
   */
  label?: ReactNode;
  /**
   * @description 是否必填
   */
  required?: boolean;
  /**
   * @description 是否撑满, 一般用于在弹窗内表单样式美化
   */
  full?: boolean;
  /**
   * @description Form.Item中rule属性设置，具体请参考 https://ant.design/components/form-cn/#Rule
   */
  rules: any[];
  /**
   * @description Form.Item中dependencies属性设置，具体请参考 https://ant.design/components/form-cn/#dependencies
   */
  dependencies: NamePath[];
  /**
   * @description Form.Item的属性设置，具体请参考 https://ant.design/components/form-cn/#Form.Item
   * @default   {}
   */
  formItemConfig?: FormItemProps;
  children?: any; // 类似vue的slot
}

const FormMergeRules: FC<FormMergeRulesProps> = ({
  required,
  children,
  rules,
  dependencies,
  formItemConfig,
  label,
  full = false
}) => {
  return (
    <Form.Item
      name='no-mean'
      label={label}
      rules={rules}
      dependencies={dependencies}
      required={required}
      {
        ...formItemConfig
      }>
      <Space className={cs(full ? styles.mergeRulesFull : '')}>
        {children}
      </Space>
    </Form.Item>
  );
};

export default FormMergeRules;

