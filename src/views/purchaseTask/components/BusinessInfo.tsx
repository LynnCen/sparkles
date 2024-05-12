import { FC } from 'react';
import { Col, Row, Typography } from 'antd';
import { Description, PageContainer } from '@/common/components';

const { Title } = Typography;

const BusinessInfo: FC<any> = ({
  business
}) => {
  const { busName, contactMobile, contactName, orderAt } = business;
  return (
    <>
      <Title level={5}>商家信息</Title>
      <PageContainer noMargin noPadding>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='商家名称' border>{busName}</Description>
          </Col>
          <Col span={12}>
            <Description label='联系人' border>{`${contactName} ${contactMobile}`}</Description>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='下单时间' border>{orderAt}</Description>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default BusinessInfo;

