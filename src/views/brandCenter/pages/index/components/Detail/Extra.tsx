/**
 * @Description 品牌详情 - 扩展信息
 */

import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';

const Extra: FC<any> = ({
  info,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  return (
    <div className={styles.tabBasic} style={{
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='扩展信息' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='拓展状态' value={info.expansionStatus}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='开店方式' value={info.openingMethod}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='合作方式' value={info.cooperationMethod}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='合作期限' value={info.cooperationPeriod}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='面积要求' value={info.areaRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='今年计划拓展' value={info.expandPlan}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='拓展区域' value={info.expandArea} type='textarea' useMoreBtn textAreaRows={3}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='重点拓展城市' value={info.expandCity}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='其他要求' value={info.otherRequirement} type='textarea' useMoreBtn textAreaRows={3}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Extra;
