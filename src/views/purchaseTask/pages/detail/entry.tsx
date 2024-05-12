import { FC, useEffect, useState } from 'react';
import { Col, Row, Typography, Space, Divider } from 'antd';
import { Description, PageContainer } from '@/common/components';
import { useLocation } from 'react-router-dom';
import { urlParams } from '@lhb/func';
import { detail } from '@/common/api/purchaseTask';
import BusinessInfo from '@/views/purchaseTask/components/BusinessInfo';
import ActivityInfo from '@/views/purchaseTask/components/ActivityInfo';

const { Title, Text } = Typography;

// 状态  1：待处理  2：审核通过  3：审核拒绝
const textColorMap = new Map([
  [1, '#FF861D'],
  [2, '#1BA373'],
  [3, '#F23030'],
]);

const Detail: FC<any> = () => {
  const [info, setInfo] = useState<any>({});
  const { search } = useLocation();
  const { id } = urlParams(search) as any as { id?: string };
  const {
    number,
    createdAt,
    statusName,
    status,
    mark,
    supply = {},
    spot = {},
    price = {},
    business = {},
    activity = {},
  } = info;

  const getInfo = async (id: number) => {
    const result = await detail(id);
    if (result) {
      setInfo(result);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    getInfo(id as any);
  }, [id]);

  const renderSupplyInfo = () => {
    return (
      <>
        <Title level={5}>供应商信息</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='供应商' border>{supply.supplyName}</Description>
          </Col>
          <Col span={12}>
            <Description label='联系人' border>{`${supply.contactName} ${supply.contactMobile}`}</Description>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='供应商合同' border>{supply.contractNum}</Description>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Description label='备注内容' border>{mark || '-'}</Description>
          </Col>
        </Row>
      </>
    );
  };

  const renderSpotInfo = () => {
    const { placeName, spotName, dates, area } = spot;
    return (
      <>
        <Title level={5}>点位信息</Title>
        <PageContainer noMargin noPadding>
          <Row gutter={20}>
            <Col span={12}>
              <Description label='点位名称' border>{placeName}-{spotName}</Description>
            </Col>
            <Col span={12}>
              <Description label='活动时间' border>{Array.isArray(dates) ? dates.join(',') : '-'}</Description>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Description label='点位面积' border>{area || '-'}</Description>
            </Col>
          </Row>
        </PageContainer>
      </>
    );
  };

  const renderPriceInfo = () => {
    const { purchaseFee, placeFee, priceDetail, purchasePeriods, depositFee, depositPeriods, depositRecoveryDate } = price;
    return (
      <>
        <Title level={5}>价格信息</Title>
        <Row gutter={20}>
          <Col span={12}>
            <Description border label={
              <Space direction='vertical' style={{ textAlign: 'right' }} size={0}>
                <span>成本</span>
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
                        {date}{`￥${amount}`}
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
                        {date}{`￥${amount}`}
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
      <PageContainer noMargin wrapStyle={{ paddingTop: 20, paddingBottom: 32 }}>
        <Title level={4}>基础信息</Title>
        <Row gutter={40}>
          <Col >
            <Description direction='vertical' label='任务编号'>
              <Text copyable={{ text: number }}>{number}</Text>
            </Description>
          </Col>
          <Col >
            <Description direction='vertical' label='创建时间'>{createdAt}</Description>
          </Col>
          <Col >
            <Description direction='vertical' label='状态'>
              <Text style={{ color: textColorMap.get(status) }}>{statusName}</Text>
            </Description>
          </Col>
        </Row>
      </PageContainer>
      <PageContainer noMargin wrapStyle={{ marginTop: 16, paddingTop: 20, paddingBottom: 32 }}>
        {!!supply && renderSupplyInfo()}
        {!!spot && renderSpotInfo()}
        {!!price && renderPriceInfo()}
        <Divider></Divider>
        {!!business && <BusinessInfo business={business}/>}
        {!!activity && <ActivityInfo activity={activity}/>}
      </PageContainer>
    </>
  );
};

export default Detail;
