import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useMethods } from '@lhb/hook';

const DynamicRangePicker: React.FC<any> = ({ value, onChange }) => {
  const { RangePicker } = DatePicker;

  const { onTimeChange } = useMethods({
    onTimeChange(_, dateStrings) {
      onChange(dateStrings);
    },
  });
  return (
    <div>
      <RangePicker
        onChange={onTimeChange}
        format='YYYY.MM.DD'
        {...(value && { value: [value[0] && dayjs(value[0], 'YYYY.MM.DD'), value[1] && dayjs(value[1], 'YYYY.MM.DD')] })}
      />
    </div>
  );
};
export default DynamicRangePicker;
