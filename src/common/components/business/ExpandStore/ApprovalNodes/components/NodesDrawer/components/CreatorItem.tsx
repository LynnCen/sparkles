/**
 * @Description 审批发起人
  样式参照其他组件实现 ./OperatorItem
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';

const OperatorItem: FC<any> = ({
  detail = {} // 审批详情
}) => {
  return (
    <div>
      <Row gutter={20}>
        <Col span={8}>
          <V2DetailItem label='发起人' value={detail?.creator} />
        </Col>
        <Col span={8}>
          <V2DetailItem label='发起时间' value={detail?.createdAt} />
        </Col>
        <Col span={8}>
          {/* 发起机会点审批提交的是remark；
              之前的数据中发起异动审批、点位评估审批用的是reason，后续有必要时改为remark。
              目前回显处理出于兼容考虑，读取remark与applyReason */}
          <V2DetailItem label='备注' value={detail?.remark || detail?.applyReason} />
        </Col>
      </Row>
    </div>
  );
};

export default OperatorItem;
