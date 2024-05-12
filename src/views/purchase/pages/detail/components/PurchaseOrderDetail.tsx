import { FC, useImperativeHandle, useState, } from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { Description, PageContainer } from '@/common/components';
import ActiveInfo from './ActiveInfo';
import ActiveInfoEditor from './ActiveInfoEditor';

const { Title } = Typography;

interface DetailProps {
  id: number,
  info?: any,
  onRef?: any,
  loadDetail?: Function,
}

const Detail: FC<DetailProps> = ({ id, info, onRef, loadDetail }) => {

  // 编辑状态
  const [editable, setEditable] = useState(false);

  useImperativeHandle(onRef, () => ({
    onUpdate() {
      setEditable(true);
    }
  }));

  const {
    priceInfo = {},
    supply = {},
    number,
    snapshot = {},
    title,
    createdAt,
    mark,
    brands,
  } = info;
  const { placeName, spotName, specification } = snapshot;
  const { supplyName, contactName, contactMobile } = supply;
  const { purchaseFee, purchasePeriods, depositFee, depositPeriods, depositRecoveryDate, placeFee, priceDetail } = priceInfo;

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
              <Description label='采购单号' border>{number}</Description>
            </Col>
            <Col span={12}>
              <Description label='下单时间' border>{createdAt}</Description>
            </Col>
            <Col span={24}>
              <Description label='备注内容' border>{mark}</Description>
            </Col>
          </Row>
        </PageContainer>
      </>
    );
  };

  const renderPlaceInfo = () => {
    return (
      <>
        <Title level={5}>场地信息</Title>
        <PageContainer noMargin noPadding>
          <Row gutter={20}>
            <Col span={12}>
              <Description label='场地展位' border>{placeName}-{spotName}</Description>
            </Col>
            <Col span={12}>
              <Description label='点位面积' border>{specification}</Description>
            </Col>
          </Row>
        </PageContainer>
      </>
    );
  };


  const renderSupplyInfo = () => {
    return (
      <>
        <Title level={5}>供应商信息</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='供应商' border>{supplyName}</Description>
          </Col>
          <Col span={12}>
            <Description label='联系人' border>{`${contactName} ${contactMobile}`}</Description>
          </Col>
        </Row>
      </>
    );
  };


  const renderPriceInfo = () => {
    return (
      <>
        <Title level={5}>价格信息</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Description border label={
              <Space direction='vertical' style={{ textAlign: 'right' }} size={0}>
                <span>应付成本</span>
                <span style={{ fontSize: 12 }}>场地成本</span>
                {
                  Array.isArray(priceDetail) && priceDetail.map((itm: any, index: number) => (<span style={{ fontSize: 12 }} key={index}>{itm.name}</span>))
                }
              </Space>
            }>

              <Space direction='vertical' style={{ padding: 10 }}>
                <span>{purchaseFee}<span style={{ color: '#768098' }}>(不含押金）</span></span>
                <span style={{ fontSize: 12 }}>￥{placeFee}</span>
                {
                  Array.isArray(priceDetail) && priceDetail.map((itm: any, index:number) => (<span style={{ fontSize: 12 }} key={index}>￥{itm.value}</span>))
                }
              </Space>

            </Description>
          </Col>
          <Col span={12}>
            {
              (Array.isArray(purchasePeriods) && purchasePeriods.length > 1) &&
              <Description label='付款日期' border>
                <Space direction='vertical' style={{ padding: 10 }}>
                  {purchasePeriods.map((itm, index) => {
                    const { date, amount } = itm;
                    return (
                      <Space key={index}>
                        {date}
                        {`￥${amount}`}
                      </Space>
                    );
                  })}
                </Space>
              </Description>
            }
            {
              (Array.isArray(purchasePeriods) && purchasePeriods.length === 1) &&
              <Description label='付款日期' border>{ purchasePeriods[0].date }</Description>
            }
          </Col>
          <Col span={12}>
            <Description label='押金' border>{ depositFee }</Description>
          </Col>
          <Col span={12}>
            {
              (Array.isArray(depositPeriods) && depositPeriods.length > 1) &&
              <Description label='付款日期' border>
                <Space direction='vertical' style={{ padding: 10 }}>
                  {depositPeriods.map((itm, index) => {
                    const { date, amount } = itm;
                    return (
                      <Space key={index}>
                        {date}
                        {`￥${amount}`}
                      </Space>
                    );
                  })}
                </Space>
              </Description>
            }
            {
              (Array.isArray(depositPeriods) && depositPeriods.length === 1) &&
              <Description label='付款日期' border>{ depositPeriods[0].date }</Description>
            }
          </Col>
          <Col span={12}>
            <Description label='预计返回时间' border>{depositRecoveryDate}</Description>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <PageContainer wrapStyle={{ margin: '16px 0' }}>
        {renderOrderInfo()}
        {renderPlaceInfo()}
        {renderSupplyInfo()}
        {renderPriceInfo()}
        { editable ? <ActiveInfoEditor id={id} title={title} brands={brands} complete={editComplete} /> : <ActiveInfo title={title} brands={brands}/> }
      </PageContainer>
    </>
  );
};

export default Detail;
