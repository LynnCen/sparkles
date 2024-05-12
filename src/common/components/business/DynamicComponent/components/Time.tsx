/**
 * @Description 日期组件
 */

import { FC } from 'react';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormTimePicker from '@/common/components/Form/V2FormTimePicker/V2FormTimePicker';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';
import V2FormRangeTimePicker from '@/common/components/Form/V2FormRangeTimePicker/V2FormRangeTimePicker';
import { contrast } from '@lhb/func';

const Time: FC<any> = ({
  propertyItem,
  disabled,
  required,
}) => {
  const label = propertyItem.anotherName || propertyItem.name || '';
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `请选择${label || ''}`;
  // 时间设置类型: 1日期 2时分秒 3日期区间 4时分秒区间
  const valueType = contrast(restriction, 'value');

  const rules = [
    { required, message: placeholder },
  ];

  return (
    <>
      {
        // 日期
        valueType === 1 && <V2FormDatePicker
          label={label}
          name={propertyItem.identification}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rules={rules}
        />
      }
      {
        // 时分秒
        valueType === 2 && <V2FormTimePicker
          label={label}
          name={propertyItem.identification}
          disabled={disabled}
          required={required}
          rules={rules}/>
      }
      {
        // 日期区间
        valueType === 3 && <V2FormRangePicker
          label={label}
          name={propertyItem.identification}
          disabled={disabled}
          required={required}
          rules={rules}
        />
      }
      {
        // 时分秒区间
        valueType === 4 && <V2FormRangeTimePicker
          label={label}
          name={propertyItem.identification}
          disabled={disabled}
          required={required}
          rules={rules}
        />
      }
    </>
  );
};

export default Time;
