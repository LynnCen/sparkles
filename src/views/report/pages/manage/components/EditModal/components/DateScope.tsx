/* 日期范围 */
import React, { useState } from 'react';
import { Col } from 'antd';
// import dayjs from 'dayjs';
import { ScopeProps } from '../../../ts-config';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';

const scopeOptions = [
  { label: '按照实际执行时间', value: 1 },
  { label: '自定义日期', value: 2 },
];

const DateScope: React.FC<ScopeProps> = ({ showExtend, onChange }) => {
  const [dates, setDates] = useState<any>(null);
  const [value, setValue] = useState<any>(null);

  const handleChange = (e: any) => {
    if (!e) return;
    const scope = e.target.value;
    onChange(scope);
  };

  // const disabledDate = (current) => {
  //   return current && current > dayjs();
  // };

  const disabledDate = (current: any) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 29;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 29;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };

  return (
    <>
      <Col span={12}>
        <V2FormRadio
          label='时间范围'
          name='dateScope'
          options={scopeOptions}
          required
          onChange={handleChange}
        />
        {
          showExtend && <V2FormRangePicker
            name='dateRange'
            // disabledDate={disabledDate}
            config={{
              value: dates || value,
              disabledDate,
              onOpenChange,
              onChange: val => setValue(val),
              onCalendarChange: val => setDates(val)
            }}
            rules={[
              { required: true, message: '请选择日期，最多选择30天' }
            ]}/>
        }
      </Col>
    </>
  );
};

export default DateScope;
