/**
 * @Description 品牌详情 - 选址信息
 */

import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';

const Location: FC<any> = ({
  info,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  return (
    <div className={styles.tabBasic} style={{
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='选址要求' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='临街要求' value={info.streetRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='消费阶层' value={info.consumptionLevel}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='商圈要求' value={info.businessCircle}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='客户特征' value={info.customer}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='人口数量/辐射半径' value={info.populationDensity}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='特殊要求' value={info.specialRequirement} type='textarea' useMoreBtn textAreaRows={3}/>
          </Col>
        </Row>
      </V2DetailGroup>
      <V2Title type='H2' text='物业要求' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='楼层要求' value={info.floorRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='主入口宽度要求' value={info.widthRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='层高要求' value={info.heightRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='柱距要求' value={info.distanceRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='供电要求' value={info.powerRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='烟道要求' value={info.flueRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='上下水要求' value={info.plumbRequirement}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='特殊要求' value={info.propertyRequirement} type='textarea' useMoreBtn textAreaRows={3}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='首选物业' value={info.preferProperty}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Location;
