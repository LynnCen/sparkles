/**
 * @Description 踩点组件（该组件所有name为前端自己定义，不可与动态模版的唯一标识identification相同重复！）
 */

import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import V2FormRadio from '@/common/components/Form/V2FormRadio/V2FormRadio';
import V2FormRangeTimePicker from '@/common/components/Form/V2FormRangeTimePicker/V2FormRangeTimePicker';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { Form } from 'antd';
import { FC, useEffect } from 'react';

export const radioEnum = {
  DENY: 'deny',
  AGREE: 'agree'
};
export const timeRulesEnum = {
  WEEKDAY: 1,
  WEEKEND: 2,
  BOTH_WEEKDAY_WEEKEND: 3
};
const radioOptions = [
  { label: '否', value: radioEnum.DENY },
  { label: '是', value: radioEnum.AGREE },
];
// WEEKDAY(1),   WEEKEND(2),  BOTH_WEEKDAY_WEEKEND(3);
const timeRules = [
  { label: '周一至周五选踩1天', value: timeRulesEnum.WEEKDAY },
  { label: '周六周日选踩1天', value: timeRulesEnum.WEEKEND },
  { label: '周中周末各踩1天', value: timeRulesEnum.BOTH_WEEKDAY_WEEKEND },
];
/**
 * @Description 踩点组件
 */
const Footprint:FC<any> = ({
  form,
  required,
  disabled,
}) => {
  const isShow = Form.useWatch('dynamicComponent_footprint_isStart', form);
  const timeRule = Form.useWatch('dynamicComponent_footprint_checkRule', form);
  const getDays = (rule) => {
    if (rule === timeRulesEnum.BOTH_WEEKDAY_WEEKEND) {
      return 2;// 累计踩点天数：2天
    }
    if (rule === timeRulesEnum.WEEKDAY || rule === timeRulesEnum.WEEKEND) {
      return 1;// 累计踩点天数：1天
    }
    return 0;
  };
  useEffect(() => {
    form.setFieldValue('dynamicComponent_footprint_days', getDays(timeRule));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRule]);

  return <div>
    <V2FormRadio required={required} disabled={disabled} form={form} label='是否发起踩点' name='dynamicComponent_footprint_isStart' options={radioOptions} />
    {
      isShow === radioEnum.AGREE &&
    <div>
      <V2FormSelect disabled={disabled} required name='dynamicComponent_footprint_checkRule' label='踩点日期规则' options={timeRules}/>
      <V2FormInputNumber required disabled label='累计踩点天数' name='dynamicComponent_footprint_days' min={0} precision={0}/>
      <V2FormRangeTimePicker disabled={disabled} required label='踩点时间' name='dynamicComponent_footprint_checkPeriod'
        config={{ format: 'HH:mm', minuteStep: 30 }}
      />
      <V2FormInput label='提示' config={{ defaultValue: '在踩点宝查看详细踩点任务信息' }} disabled={true}/>
    </div>
    }
  </div>;
};

export default Footprint;
