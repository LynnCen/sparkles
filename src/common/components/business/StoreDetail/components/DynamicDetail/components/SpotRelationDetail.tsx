/**
 * @Description 机会点详情-网规信息下的集客点详情
 */

import { FC } from 'react';
import { Row, Col } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import { isArray } from '@lhb/func';
import LocationMap from '../../LocationMap';
import React from 'react';


const SpotRelationDetail:FC<any> = ({
  info = {},
  detailInfoConfig = { span: 12 },
}) => {

  return <>
    <V2Title
      type='H2'
      divider
      text={'集客点信息'}
      className={'mt-24'}/>
    <Row gutter={24}>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='集客点名称' value={info.name}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='动线始末' value={info.editDescription}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='集客A类点' value={info.pointName}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='预估日均金额' value={info.estimatedDailyAmount}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='租金单价行情' value={info.rent}/>
      </Col>
      <Col {...detailInfoConfig}>
        <V2DetailItem label='转让费行情' value={info.assignmentFee}/>
      </Col>
      <Col span={24}>
        <V2DetailItem label='A类坐标点位置' value={info.openStores}>
          <LocationMap lng={info?.lng} lat={info?.lat} />
        </V2DetailItem>
      </Col>
      <Col span={24}>
        <V2DetailItem label='A类点视频讲解' type='videos' assets={info.videoUrls}/>
      </Col>
    </Row>
    { isArray(info.competitors) && info.competitors.length && <>
      <V2Title
        type='H2'
        divider
        text={'竞品分析'}
        className={'mt-24'}/>
      <Row gutter={24}>
        { info.competitors.map((item:any, index:number) => {
          return <React.Fragment key={index}>
            <Col {...detailInfoConfig}>
              <V2DetailItem label='竞品名称' value={item.competitorName}/>
            </Col>
            <Col {...detailInfoConfig}>
              <V2DetailItem label='日均预估' value={item.aveEstimatedSale}/>
            </Col>
          </React.Fragment>;
        }) }
      </Row>
    </>}
    {
      isArray(info.landlords) && info.landlords.length && <>
        <V2Title
          type='H2'
          divider
          text={'店铺信息'}
          className={'mt-24'}/>
        <Row gutter={24}>
          { info.landlords.map((item:any, index:number) => {
            return <React.Fragment key={index}>
              <Col {...detailInfoConfig}>
                <V2DetailItem label='店铺名称' value={item.landlordShopName}/>
              </Col>
              <Col {...detailInfoConfig}>
                <V2DetailItem label='房东姓名' value={item.landlordName}/>
              </Col>
              <Col {...detailInfoConfig}>
                <V2DetailItem label='房东电话' value={item.landlordMobile}/>
              </Col>
            </React.Fragment>;
          })
          }
        </Row>
      </>
    }
  </>;
};

export default SpotRelationDetail;
