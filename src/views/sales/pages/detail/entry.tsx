import { detail } from '@/common/api/sales';
import { Description, PageContainer } from '@/common/components';
import { urlParams } from '@lhb/func';
import { Col, Row, Tabs, TabsProps, Typography } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Recoder, SaleOrderDetail } from './components';
import { Sticky, StickyContainer } from 'react-sticky';
import Action from '@/views/sales/components/Action';

export const textColorMap = new Map([
  [2, '#FF861D'],
  [3, '#FF861D'],
  [4, '#0039C2'],
  [5, '#1BA373'],
  [6, '#F23030'],
  [7, '#999999'],
  [1, '#FF861D']
]);


export const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
  <Sticky topOffset={200} >
    {({ style }) => (
      <DefaultTabBar {...props} style={{ zIndex: 1,
        background: '#fff', padding: 8, ...style }} />
    )}
  </Sticky>
);

interface DetailProps {

}

const { Title, Text } = Typography;

const Detail: FC<DetailProps> = () => {
  const [info, setInfo] = useState<any>({});
  const { search } = useLocation();
  const { id } = urlParams(search) as any as { id?: string };
  const {
    snapshot = {},
    title,
    displayDates = [],
    dates,
    statusName,
    status,
    orderStateId,
    permissions = [],
    reason,
    cost,
    mark,
  } = info;
  const {
    placeName,
    spotName,
  } = snapshot;

  const loadDetail = async () => {
    const result = await detail(id as any);
    if (result) {
      setInfo(result);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    loadDetail();
  }, [id]);

  const saleOrderDetailRef: any = useRef();

  const btn = permissions.map(item => {
    return {
      ...item,
      type: 'primary'
    };
  });

  const items = [
    {
      label: '销售单信息',
      key: 'saleOrderDetail',
      children: <SaleOrderDetail id={Number(id as any)} info={info} onRef={saleOrderDetailRef} loadDetail={loadDetail} />
    },
    {
      label: '操作记录',
      key: 'recoder',
      children: <Recoder id={id as any}/>
    }
  ];

  const onUpdate = () => {
    saleOrderDetailRef.current.onUpdate();
  };

  return (
    <StickyContainer >
      <PageContainer noMargin wrapStyle={{ paddingBottom: 16 }}>
        <Row>
          <Col flex={1}>
            <Title level={4}>基础信息</Title>
          </Col>
          <Col>
            <Action
              id={id as any}
              btns={btn}
              orderStateId={orderStateId}
              info={{ price: cost, dates, mark, depositPeriods: info.depositPeriods, salePeriods: info.salePeriods }}
              cb={() => loadDetail()}
              onUpdate={onUpdate}
            />
          </Col>
        </Row>
        <Row gutter={40}>
          <Col >
            <Description direction='vertical' label='场地点位'>{placeName}-{spotName}</Description>
          </Col>
          <Col >
            <Description direction='vertical' label='活动名称'>{title}</Description>
          </Col>
          <Col >
            <Description direction='vertical' label='活动时间'>
              <Text ellipsis={{ tooltip: displayDates.join(',') }} style={{ maxWidth: 500 }}>
                {displayDates.join(',')}
              </Text>
            </Description>
          </Col>
          <Col >
            <Description direction='vertical' label='状态'>
              <Text style={{ color: textColorMap.get(status) }}>{statusName}</Text>
              {!!reason && (<Text style={{ maxWidth: 200 }}>（{reason}）</Text>)}
            </Description>
          </Col>
          {/* <Col >
            <Description direction='vertical' label='毛利(毛利率)'>-</Description>
          </Col> */}
        </Row>
      </PageContainer>
      <PageContainer noMargin wrapStyle={{ marginTop: 16 }}>
        <Tabs destroyInactiveTabPane items={items} renderTabBar={renderTabBar} />
      </PageContainer>
    </StickyContainer>
  );
};

export default Detail;
