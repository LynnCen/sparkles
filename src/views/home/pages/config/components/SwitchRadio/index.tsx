import { Radio, RadioGroupProps } from 'antd';
import { FC } from 'react';

import styles from './index.module.less';
import { DefaultFormItemProps } from '@/common/components/Form/V2FormRadio/V2FormRadio';


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
