/**
 * @Description 文本域输入框
 */

import { FC } from 'react';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';
import { isNotEmpty, contrast } from '@lhb/func';
import styles from '../index.module.less';

const TextareaInput: FC<any> = ({
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
    <V2FormTextArea
      label={label}
      name={propertyItem.identification}
      placeholder={placeholder}
      maxLength={max}
      required={required}
      rules={rules}
      className={styles.textareaItem}
      disabled={disabled}
    />
  );
};

export default TextareaInput;
