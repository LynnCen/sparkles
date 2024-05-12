/**
 * @Description : 时间范围选择器，默认选择本月，可选择近本月、上月、仅3月，本季度，上季度，今年
 */
import { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useMethods } from '@lhb/hook';
import { DownOutlined } from '@ant-design/icons';
import SwitchRadio from '../SwitchRadio';

import styles from './index.module.less';
import V2FormRangePicker from '@/common/components/Form/V2FormRangePicker/V2FormRangePicker';


// 获取当前季度方法
function getQuarterTimes(): [any, any] {
  const curMonth = dayjs().month() + 1; // 获取到当前月
  if (curMonth <= 3) {
    return [dayjs().month(0).startOf('month'), dayjs().month(2).endOf('month')];
  } else if (curMonth <= 6) {
    return [dayjs().month(3).startOf('month'), dayjs().month(5).endOf('month')];
  } else if (curMonth <= 9) {
    return [dayjs().month(6).startOf('month'), dayjs().month(8).endOf('month')];
  } else {
    return [dayjs().month(9).startOf('month'), dayjs().month(11).endOf('month')];
  }
}
// 获取上一季度方法
function getLastQuarterTimes(): [any, any] {

  const currentDate = dayjs(); // 当前日期
  const lastQuarterStart = currentDate.subtract(1, 'quarter').startOf('quarter'); // 上一季度的开始日期
  const lastQuarterEnd = currentDate.subtract(1, 'quarter').endOf('quarter'); // 上一季度的结束日期

  return [lastQuarterStart, lastQuarterEnd];
}


const options: any[] = [
  { label: '本月', value: 'oneMonth' },
  { label: '上月', value: 'lastMonth' },
  { label: '近3月', value: 'threeMonth' },
  { label: '本季度', value: 'quarter' },
  { label: '上季度', value: 'lastQuarter' },
  { label: '今年', value: 'year' },
];

const TimeSelect: FC<any> = ({
  form,
  label,
  name,
  rangePickerConfig = {},
  defaultTime = 'year',
  onRadioChange
}) => {

  const [timeType, setTimeType] = useState<string>('year');

  const methods = useMethods({
    // 切换radio
    changeType(e) {
      setTimeType(e.target.value);
      switch (e.target.value) {
        case 'oneMonth':
          onRadioChange({ [name]: [dayjs().startOf('month'), dayjs().endOf('month')] });
          form.setFieldsValue({
            [name]: [dayjs().startOf('month'), dayjs().endOf('month')],
          });

          return;
        case 'lastMonth':
          onRadioChange({ [name]: [dayjs().startOf('month').subtract(1, 'month'), dayjs().endOf('month').subtract(1, 'month')] });
          form.setFieldsValue({ // 获取上一个月
            [name]: [dayjs().startOf('month').subtract(1, 'month'), dayjs().endOf('month').subtract(1, 'month')],
          });
          return;
        case 'threeMonth':
          onRadioChange({ [name]: [dayjs().subtract(2, 'month').startOf('month'), dayjs().endOf('month')] });
          form.setFieldsValue({
            [name]: [dayjs().subtract(2, 'month').startOf('month'), dayjs().endOf('month')],
          });
          return;
        case 'quarter':
          onRadioChange({ [name]: getQuarterTimes() });
          form.setFieldsValue({
            [name]: getQuarterTimes(),
          });
          return;
        case 'lastQuarter':
          onRadioChange({ [name]: getLastQuarterTimes() });
          form.setFieldsValue({
            [name]: getLastQuarterTimes(),
          });
          return;
        case 'year':
          onRadioChange({ [name]: [dayjs().startOf('year'), dayjs().endOf('year')] });
          form.setFieldsValue({
            [name]: [dayjs().startOf('year'), dayjs().endOf('year')]
          });
          return;
        default:
          break;
      }
    },
    // 用日期范围选择时间
    changeTime(val) {
      if (Array.isArray(val) && val.length === 2) {
        form.setFieldsValue({
          [name]: [dayjs(val[0]).startOf('month'), dayjs(val[1]).endOf('month')],
        });
      }
      setTimeType('11'); // 随便设置一个值不选择时间选择，置空radio
    },
  });

  // const disabledDate = (current) => {
  //   if (!dates) {
  //     return false;
  //   }
  //   const tooLate = dates[0] && current.diff(dates[0], 'month') > 23;
  //   const tooEarly = dates[1] && dates[1].diff(current, 'month') > 23;

  //   return !!tooEarly || !!tooLate || current && current < dayjs('2021-01-01');// 不能选中2022-1-1之前
  // };

  const onOpenChange = () => {
    // 在打开的时候可以选中任意时间
    // setDates([null, null]);
  };

  useEffect(() => {
    // 默认今年
    form.setFieldsValue({
      [name]: [dayjs().startOf('year'), dayjs().endOf('year')]
    });
  }, []);

  return (
    <div className={styles.timeSelectContainer} >
      <V2FormRangePicker
        label={label}
        name={name}
        config={{
          format: 'YYYY.MM',
          suffixIcon: <DownOutlined />,
          // disabledDate: disabledDate,
          onChange: methods.changeTime,
          picker: 'month',
          // onCalendarChange: val => setDates(val),
          onOpenChange: onOpenChange,
          style: {
            width: 220
          },
          // onChange: val => setValue(val),
          ...rangePickerConfig
        }}
      />
      <SwitchRadio
        type='primary'
        defaultValue={defaultTime}
        config={{
          value: timeType,
        }}
        onChange={methods.changeType}
        options={options} />

    </div>
  );
};

export default TimeSelect;
