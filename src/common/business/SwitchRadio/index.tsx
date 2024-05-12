import { DefaultFormItemProps } from '@/common/components/Form/FormMultipleDatePicker/FormMultipleDatePicker';
import { Radio, RadioGroupProps } from 'antd';
import { FC } from 'react';

import styles from './index.module.less';


export interface SwitchRadioProps extends DefaultFormItemProps {
  type?: 'primary' | 'default';
  options?: any[];
  onChange?: Function;
  defaultValue?: any;
  config?: RadioGroupProps; // antd Radio 的入参
}

const SwitchRadio: FC<SwitchRadioProps> = ({
  type = 'primary', // 按钮样式，可选'primary' | 'default'
  defaultValue,
  options,
  onChange,
  config = {},
}) => {

  return (
    <div className={styles[type === 'primary' ? 'primaryRadio' : 'defaultRadio']}>
      <Radio.Group
        value={defaultValue}
        options={options}
        optionType='button'
        onChange={(e) => onChange && onChange(e)}
        {...config}
      />
    </div>
  );
};

export default SwitchRadio;
