// 带前置筛选的下拉框
import { Form } from 'antd';
import { FC } from 'react';
import V2FormSelect from '../Form/V2FormSelect/V2FormSelect';
import styles from './index.module.less';

const Component: FC<{
  label: string;
  name?: string;
  placeholder?: string;
  options?: Array<any>; // 筛选的数据
  preName: string; // 前置筛选绑定的数据名称
  preOptions: Array<any>; // 前置筛选的数据
  preDefaultValue: any; // 前置筛选的默认值
  config?: any;
  children?: any;
  disabled?: boolean;
}> = ({
  label,
  name,
  placeholder,
  options = [],
  preName,
  preOptions,
  preDefaultValue,
  config,
  children = null,
  disabled = false,
}) => {
  return (
    <Form.Item label={label} className={styles.item}>
      <V2FormSelect
        name={preName}
        options={preOptions}
        allowClear={false}
        formItemConfig={{ initialValue: preDefaultValue }}
        className={styles.preSelect}
      />
      {children || <V2FormSelect
        name={name}
        placeholder={placeholder}
        options={options}
        allowClear
        config={{ ...config }}
        disabled={disabled}
        className={styles.content}
      />}
    </Form.Item>
  );
};

export default Component;
