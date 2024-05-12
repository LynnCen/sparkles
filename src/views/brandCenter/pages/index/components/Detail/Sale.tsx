/**
 * @Description 品牌详情 - 销售信息
 */


import { FC } from 'react';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import styles from './index.module.less';
import V2Title from '@/common/components/Feedback/V2Title';

const Sale: FC<any> = ({
  info,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  return (
    <div className={styles.tabBasic} style={{
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='销售信息' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='城市人均消费/客单价' value={info.consumption}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Sale;
