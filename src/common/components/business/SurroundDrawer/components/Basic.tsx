/**
 * @Description 周边详情基本信息
 */

import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import { fixNumberSE } from '@/common/utils/ways';
import { isDef } from '@lhb/func';

const Basic: FC<any> = ({
  name,
  radius,
  area,
  createdAt,
}) => {
  return (
    <V2DetailGroup>
      <Row gutter={16}>
        <Col span={8}>
          <V2DetailItem label='查询地点' value={name}/>
        </Col>
        <Col span={8}>
          <V2DetailItem label='查询范围' value={area ? `${area}k㎡` : isDef(radius) ? (+radius < 1000 ? `${+radius}m` : `${fixNumberSE(radius / 1000.0)}km`) : '-'}/>
        </Col>
        {isDef(createdAt) && <Col span={8}>
          <V2DetailItem label='查询时间' value={createdAt}/>
        </Col>}
      </Row>
    </V2DetailGroup>
  );
};

export default Basic;
