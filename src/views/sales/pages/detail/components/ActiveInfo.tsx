// 基本信息
import { FC } from 'react';
import { Col, Divider, Row, Typography, Image } from 'antd';
import { Description, PageContainer } from '@/common/components';
import { QiniuImageUrl } from '@/common/utils/qiniu';

const { Title } = Typography;
const { PreviewGroup } = Image;

const Component:FC<{info: any}> = ({ info = {} }) => {
  const {
    snapshot = {},
    title,
    displayDates = [],
    brands = [],
    materials = [],
    promotionWays = [],
    industries = [],
    promotionPurposes = [],
    licenses = [],
    product,
  } = info;
  const {
    entranceDate,
    withdrawDate,
    usableLength,
    usableWidth,
    usableHeight,
    length,
    width,
    height,
    graph = [],
  } = snapshot;

  return (
    <>
      <Title level={5}>活动信息</Title>
      <PageContainer noPadding noMargin>
        <Row gutter={20}>
          <Col span={12}>
            <Description border label='活动名称'>{title}</Description>
          </Col>
          <Col span={12}>
            <Description border label='所属行业'>{ industries.length ? industries.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='产品名称'>{product || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='品牌名称'>{ brands.length ? brands.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='推广形式'>{promotionWays.length ? promotionWays.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='推广目的'>{promotionPurposes ? promotionPurposes.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='活动日期'>{displayDates.join(',')}</Description>
          </Col>
          <Col span={12}>
            <Description border label='进场日期'>{entranceDate || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='撤场日期'>{withdrawDate || '-'}</Description>
          </Col>
        </Row>
      </PageContainer>

      <Divider style={{ margin: '16px 0', marginTop: 0, background: '#EEEEEE' }}/>
      <PageContainer noPadding noMargin>
        <Row>
          <Col span={12}>
            <Description border label='活动面积'>{
              [usableLength, usableWidth, usableHeight].filter(Boolean).map(item => `${item}m`).join('*')
            }</Description>
          </Col>
          <Col span={12}>
            <Description border label='物料类型'>{materials.length ? materials.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='展具尺寸'>{
              [length, width, height].filter(Boolean).map(item => `${item}m`).join('*')
            }</Description>
          </Col>
          <Col span={12}>
            <Description border label='品牌名称'>{brands.length ? brands.map(item => item.name).join(',') : '-'}</Description>
          </Col>
          {/* <Col span={12}>.j
              <Description border label='是否有搭建'>todo</Description>
            </Col> */}
          <Col span={24}>
            <Description border label='效果图'>
              <PreviewGroup>
                {graph.map((item, index) => {
                  return (
                    <Image key={index} src={QiniuImageUrl(item)} width={50} height={50} />
                  );
                })}
              </PreviewGroup>
            </Description>
          </Col>
          <Col span={24}>
            <Description border label='经营许可证品牌授权书'>
              <PreviewGroup>
                {licenses.map((item, index) => {
                  return (
                    <Image key={index} src={QiniuImageUrl(item)} width={50} height={50} />
                  );
                })}
              </PreviewGroup>
            </Description>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default Component;
