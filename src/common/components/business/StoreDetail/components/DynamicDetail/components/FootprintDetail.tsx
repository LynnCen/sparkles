/**
 * @Description 机会点详情-踩点组件
 */
import { FC, useMemo } from 'react';
import { Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

// 是否发起踩点设置值
const radioEnum = {
  DENY: 'deny',
  AGREE: 'agree'
};
// 踩点规则设置值
const timeRulesEnum = {
  WEEKDAY: 1,
  WEEKEND: 2,
  BOTH_WEEKDAY_WEEKEND: 3
};
// 是否发起踩点选项
const radioOptions = [
  { name: '否', id: radioEnum.DENY },
  { name: '是', id: radioEnum.AGREE },
];
// 踩点规则选项
// WEEKDAY(1),   WEEKEND(2),  BOTH_WEEKDAY_WEEKEND(3);
const timeRules = [
  { name: '周一至周五选踩1天', id: timeRulesEnum.WEEKDAY },
  { name: '周六周日选踩1天', id: timeRulesEnum.WEEKEND },
  { name: '周中周末各踩1天', id: timeRulesEnum.BOTH_WEEKDAY_WEEKEND },
];

const FootprintDetail: FC<any> = ({
  info = {},
  detailInfoConfig = { span: 12 },
}) => {

  /**
   * @description 是否踩点 展示文字
   */
  const onOffValue = useMemo(() => {
    let val = '';
    if (info && info.dynamicComponent_footprint_isStart) {
      const target = radioOptions.find((itm: any) => itm.id === info.dynamicComponent_footprint_isStart);
      if (target) {
        val = target.name;
      }
    }
    return val;
  }, [info]);

  /**
   * @description 踩点规则 展示文字
   */
  const timeRuleValue = useMemo(() => {
    let val = '';
    if (info && info.dynamicComponent_footprint_checkRule) {
      const target = timeRules.find((itm: any) => itm.id === info.dynamicComponent_footprint_checkRule);
      if (target) {
        val = target.name;
      }
    }
    return val;
  }, [info]);

  /**
   * @description 踩点天数 展示文字
   */
  const dayCountValue = useMemo(() => {
    let val = '';
    if (info && info.dynamicComponent_footprint_checkRule) {
      // const count = getDayCount(info.dynamicComponent_footprint_checkRule);

      let count = 0;
      const rule = info.dynamicComponent_footprint_checkRule;
      if (rule === timeRulesEnum.BOTH_WEEKDAY_WEEKEND) {
        count = 2;// 累计踩点天数：2天
      } else if (rule === timeRulesEnum.WEEKDAY || rule === timeRulesEnum.WEEKEND) {
        count = 1;// 累计踩点天数：1天
      }
      val = `${count}天`;
    }
    return val;
  }, [info]);

  /**
   * @description 踩点时间 展示文字
   */
  const timeValue = useMemo(() => {
    let val = '';
    if (info && info.dynamicComponent_footprint_checkPeriod) {
      val = Array.isArray(info.dynamicComponent_footprint_checkPeriod) && info.dynamicComponent_footprint_checkPeriod.length === 2 ? info.dynamicComponent_footprint_checkPeriod.join(' - ') : '';
    }
    return val;
  }, [info]);

  /* method */

  return (<>
    {info?.dynamicComponent_footprint_isStart !== radioEnum.AGREE && <Col span={24}></Col>}
    <Col {...detailInfoConfig}>
      <V2DetailItem label='是否发起踩点' value={onOffValue}/>
    </Col>
    {
      info?.dynamicComponent_footprint_isStart === radioEnum.AGREE && <>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='踩点日期要求' value={timeRuleValue}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='累计踩点天数' value={dayCountValue}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='踩点时间' value={timeValue}/>
        </Col>
        <Col {...detailInfoConfig}>
          <V2DetailItem label='提示' value='在踩点宝查看详细踩点任务信息'/>
        </Col>
      </>
    }
  </>);
};

export default FootprintDetail;
