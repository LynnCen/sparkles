import { FC } from 'react';
import { Col, Row, Typography, Divider, Image } from 'antd';
import { Description, PageContainer } from '@/common/components';
import { QiniuImageUrl } from '@/common/utils/qiniu';
import styles from './index.module.less';

const { Title } = Typography;
const { PreviewGroup } = Image;

const ActivityInfo: FC<any> = ({
  activity
}) => {
  const { title, industry, product, brand, promotionWay, promotionPurpose, dates, entranceDate, withdrawDate } = activity;
  const { length, width, height, material, usableLength, usableWidth, usableHeight, licenses, graph } = activity;
  return (
    <>
      <Title level={5}>活动信息</Title>
      <PageContainer noPadding noMargin>
        <Row gutter={20}>
          <Col span={12}>
            <Description border label='活动名称'>{title || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='所属行业'>{industry || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='产品名称'>{product || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='品牌名称'>{brand || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='推广形式'>{promotionWay || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='推广目的'>{promotionPurpose || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='活动日期'>{Array.isArray(dates) ? dates.join(',') : '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='进场日期'>{entranceDate || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='撤场日期'>{withdrawDate || '-'}</Description>
          </Col>
        </Row>

        <Divider></Divider>

        <Row>
          <Col span={12}>
            <Description border label='展具尺寸'>{length && width && height
              ? [length, width, height].filter(Boolean).map(item => `${item}m`).join('*') : '-'
            }</Description>
          </Col>
          <Col span={12}>
            <Description border label='物料类型'>{material || '-'}</Description>
          </Col>
          <Col span={12}>
            <Description border label='使用尺寸'>{ usableLength && usableWidth && usableHeight
              ? [usableLength, usableWidth, usableHeight].filter(Boolean).map(item => `${item}m`).join('*') : '-'
            }</Description>
          </Col>
          {/* <Col span={12}>.j
          <Description border label='是否有搭建'>todo</Description>
        </Col> */}
          <Col span={24} className={styles.activityImage}>
            <Description border label='经营许可证品牌授权书'>
              <PreviewGroup>
                {Array.isArray(licenses) && licenses.length ? licenses.map((item, index) => {
                  return (
                    <Image key={index} src={QiniuImageUrl(item)} width={50} height={50}/>
                  );
                }) : '-'}
              </PreviewGroup>
            </Description>
          </Col>
          <Col span={24} className={styles.activityImage}>
            <Description border label='效果图'>
              <PreviewGroup>
                {Array.isArray(graph) && graph.length ? graph.map((item, index) => {
                  return (
                    <Image key={index} src={QiniuImageUrl(item)} width={50} height={50} />
                  );
                }) : '-'}
              </PreviewGroup>
            </Description>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default ActivityInfo;
