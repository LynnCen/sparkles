/**
 * @Description 输入框类型的组件
 */

import { FC } from 'react';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { isNotEmpty, contrast } from '@lhb/func';

const Input: FC<any> = ({
  propertyItem,
  disabled,
  required,
}) => {
  const label = propertyItem.anotherName || propertyItem.name || '';
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `请输入${label || ''}`;
  const min = contrast(restriction, 'min');
  const max = contrast(restriction, 'max');

  const rules = [
    { required, message: placeholder },
    () => ({
      validator(_, value) {
        if (isNotEmpty(min) && isNotEmpty(value) && value.length < min) {
          return Promise.reject(`请输入至少${min}个字`);
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <V2FormInput
      label={label}
      name={propertyItem.identification}
      placeholder={placeholder}
      maxLength={max}
      disabled={disabled}
      required={required}
      rules={rules}
    />
  );
};

export default Input;
