import { FC } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { Row, Col } from 'antd';
import styles from './index.module.less';

/*
  品牌详情-基本信息Tab
*/
const Basic: FC<any> = ({
  detail = {},
  companyName,
  style = {},
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
}) => {
  return (
    <div className={styles.tabBasic} style={{
      height: mainHeight || 'auto',
      ...style
    }}>
      <V2Title type='H2' text='品牌简介' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={24}>
            <V2DetailItem label={companyName} value={detail?.baseInfo?.brandIntroduce} type='textarea' useMoreBtn textAreaRows={3}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='业态类别' value={detail?.baseInfo?.businessType}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='品牌定位' value={detail?.baseInfo?.brandPosition}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='已进驻购物中心数	' value={detail?.baseInfo?.mallCount}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='品牌官网	' value={detail?.baseInfo?.brandWebsite}/>
          </Col>
        </Row>
      </V2DetailGroup>
      <V2Title type='H2' text='系统信息' divider/>
      <V2DetailGroup block>
        <Row gutter={16}>
          <Col span={12}>
            <V2DetailItem label='门店更新渠道	' value={detail?.systemInfo?.storeFrom}/>
          </Col>
          <Col span={12}>
            <V2DetailItem label='品牌门店更新时间	' value={detail?.systemInfo?.storeUpdateTime}/>
          </Col>
        </Row>
      </V2DetailGroup>
    </div>
  );
};

export default Basic;
