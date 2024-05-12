import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useMethods } from '@lhb/hook';

const DynamicTime: React.FC<any> = ({ value, onChange, prop }) => {
  const { RangePicker } = DatePicker;
  const restriction = JSON.parse(prop.restriction);

  const { onTimeChange } = useMethods({
    onTimeChange(_, dateStrings) {
      onChange(dateStrings);
    },
  });

  switch (restriction.value) {
    case 1: // 时间点（年，月，日）
      return <DatePicker onChange={onTimeChange} {...(value && { value: value && dayjs(value, 'YYYY-MM-DD') })} />;
    case 2: // 时间点（时，分，秒）
      return <TimePicker onChange={onTimeChange} {...(value && { value: value && dayjs(value, 'HH-mm-ss') })} />;
    case 3: // 时间段（年，月，日）
      return (
        <div>
          <RangePicker onChange={onTimeChange} format='YYYY-MM-DD' {...(value && { value: value[0] && [dayjs(value[0], 'YYYY-MM-DD'), value[1] && dayjs(value[1], 'YYYY-MM-DD')] })}/>
        </div>
      );
    case 4: // 时间段（时，分，秒）
      return (
        <TimePicker.RangePicker onChange={onTimeChange} {...(value && { value: [value[0] && dayjs(value[0], 'HH-mm-ss'), value[1] && dayjs(value[1], 'HH-mm-ss')] })} />
      );
    default:
      return <></>;
  }
};
export default DynamicTime;
