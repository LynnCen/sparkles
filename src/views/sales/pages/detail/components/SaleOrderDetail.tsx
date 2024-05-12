import { FC, useImperativeHandle, useState } from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { Description, PageContainer } from '@/common/components';
import ActiveInfo from './ActiveInfo';
import ActiveInfoEditor from './ActiveInfoEditor';

const { Title } = Typography;

const renderPriceText = (text: string) => {
  if (text) {
    return `¥${text}`;
  }

  return '-';
};

interface SaleOrderDetailProps {
  id: number,
  info?: any,
  onRef?: any,
  loadDetail?: Function,
}

const SaleOrderDetail: FC<SaleOrderDetailProps> = ({ id, info = {}, onRef, loadDetail }) => {
  const {
    cost = {},
    buss = {},
    number,
    snapshot = {},
    createdAt,
    mark,
    depositPeriods = [],
    saleFeePeriods = [],
  } = info;
  const {
    placeName,
    spotName,
    specification,
  } = snapshot;
  const { enterName, busName } = buss;
  const { billingType, saleFee, placeFee, depositFee, serviceFee, otherFee, depositWithdrawDate } = cost;

  const [editable, setEditable] = useState(false);

  useImperativeHandle(onRef, () => ({
    onUpdate() {
      setEditable(true);
    }
  }));

  const editComplete = () => {
    setEditable(false);
    loadDetail && loadDetail();
  };

  const renderOrderInfo = () => {
    return (
      <>
        <Title level={5}>单号信息</Title>
        <PageContainer noMargin noPadding>
          <Row gutter={20}>
            <Col span={12}>
              <Description label='销售单号' border>{number}</Description>
            </Col>
            <Col span={12}>
              <Description label='下单时间' border>{createdAt}</Description>
            </Col>
            <Col span={24}>
              <Description label='备注' border>{mark}</Description>
            </Col>
          </Row>
        </PageContainer>
      </>
    );
  };

  return (
    <>
      <PageContainer wrapStyle={{ margin: '16px 0' }}>
        {renderOrderInfo()}
        <Title level={5}>场地信息</Title>
        <PageContainer noMargin noPadding>
          <Row gutter={20}>
            <Col span={12}>
              <Description label='场地展位' border>{placeName}-{spotName}</Description>
            </Col>
            <Col span={12}>
              <Description label='场地面积' border>{!!specification && specification }</Description>
            </Col>
            {/* <Col span={12}>
              <Description label='采购人' border>XD2022244678</Description>
            </Col> */}
          </Row>
        </PageContainer>
        <Title level={5}>商家信息</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='商家名称' border>{enterName}</Description>
          </Col>
          <Col span={12}>
            <Description label='联系人' border>{busName}</Description>
          </Col>
          {/* <Col span={12}>
            <Description label='客户经理' border>todo</Description>
          </Col> */}
        </Row>
        <Title level={5}>价格信息</Title>
        <Row gutter={20}>
          <Col span={24}>
            <Description label='计费方式' border>{
              billingType === 1 ? '按场地日期计费' : '按销售额计费'
            }</Description>
          </Col>
          <Col span={12}>
            <Description border label={
              <Space direction='vertical' style={{ textAlign: 'right' }} size={0}>
                <span>应收收入</span>
                <span style={{ fontSize: 12 }}>场地费</span>
                <span style={{ fontSize: 12 }}>服务费</span>
                <span style={{ fontSize: 12 }}>其他费用</span>
              </Space>
            }>

              <Space direction='vertical' style={{ padding: 8, paddingTop: 3 }} size={9}>
                <span>¥{saleFee}<span style={{ color: '#768098' }}>(不含押金）</span></span>
                <span style={{ fontSize: 12 }}>{renderPriceText(placeFee)}</span>
                <span style={{ fontSize: 12 }}>{renderPriceText(serviceFee)}</span>
                <span style={{ fontSize: 12 }}>{renderPriceText(otherFee)}</span>
              </Space>
            </Description>
          </Col>
          <Col span={12}>
            {
              (Array.isArray(saleFeePeriods) && saleFeePeriods.length > 1) &&
              <Description label='付款日期' border>
                <Space direction='vertical' style={{ padding: 10 }}>
                  {saleFeePeriods.map((itm, index) => {
                    const { date, amount } = itm;
                    return (
                      <Space key={index}>
                        {date}
                        {renderPriceText(amount)}
                      </Space>
                    );
                  })}
                </Space>
              </Description>
            }
            {
              (Array.isArray(saleFeePeriods) && saleFeePeriods.length === 1) &&
              <Description label='付款日期' border>{ saleFeePeriods[0].date || '-'}</Description>
            }
          </Col>
          <Col span={12}>
            <Description label='押金' border>{renderPriceText(depositFee)}</Description>
          </Col>
          <Col span={12}>
            {
              (Array.isArray(depositPeriods) && depositPeriods.length > 1) &&
              <Description label='付款日期' border>
                <Space direction='vertical' style={{ padding: 10 }}>
                  {saleFeePeriods.map((itm, index) => {
                    const { date, amount } = itm;
                    return (
                      <Space key={index}>
                        {date}
                        {renderPriceText(amount)}
                      </Space>
                    );
                  })}
                </Space>
              </Description>
            }
            {
              (Array.isArray(depositPeriods) && depositPeriods.length === 1) &&
              <Description label='付款日期' border>{ depositPeriods[0].date || '-' }</Description>
            }
          </Col>
          <Col span={12}>
            <Description label='预计返回时间' border>{depositWithdrawDate || '-'}</Description>
          </Col>
        </Row>
        {editable ? <ActiveInfoEditor id={id} info={info} complete={editComplete}/> : <ActiveInfo info={info} />}
      </PageContainer>
    </>
  );
};

export default SaleOrderDetail;
