/**
 * @Description 场地详情-顶部
 */

import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import Slider from '../Slider';
import ToolbarNav from '../ToolbarNav';
import styles from './index.module.less';
import { Col, Divider, Row, Typography, Image } from 'antd';
import { replaceEmpty } from '@lhb/func';
import { openAMap } from '@/common/utils/ways';
import ProgressWithTitle from '@/common/components/business/ProgressWithTitleProps';
import empty360 from '@/assets/images/360.png';
import { QiniuImageUrl } from '../../utils';
import VideoPlay from '../AssessMain/components/Detail/components/VideoPlay';

const { Text, Paragraph } = Typography;
export const VREmpty = (
  <div
    style={{
      width: 50,
      height: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      background: '#000000',
    }}
  >
    <Image preview={false} src={empty360} />
  </div>
);
const Top:FC<any> = ({
  // items,
  // empty,
  // tItms,
  // onNavChange,
  activeKey,
  detail,
  appraisalReport,
  setActiveKey
}) => {
  const [empty, setEmpty] = useState<ReactNode>();
  const [items, setItems] = useState<ReactNode[]>([]);

  const {
    placeName,
    placeDescription,
    address,
    topPropertyList = [],
    placeVideo = [],
    panorama = [],
    floorPlan = [],
    placePicture = [],
  } = detail;

  const tItms = useMemo(() => {
    const tItms: any = [];
    if (placePicture?.length) {
      tItms.push({ label: '图片', key: 'placePicture' });
    }

    if (placeVideo?.length) {
      tItms.push({ label: '视频', key: 'placeVideo' });
    }

    if (panorama?.length) {
      tItms.push({ label: 'VR', key: 'panorama' });
    }

    if (floorPlan?.length) {
      tItms.push({ label: '平面图', key: 'floorPlan' });
    }
    return tItms;
  }, [detail]);

  const onNavChange = (key?: string) => {
    setActiveKey(key!);
  };

  const getItems = (key?: string) => {
    let items: any = [];
    switch (key) {
      case 'floorPlan':
        items = floorPlan;
        setEmpty('暂无图片');
        break;
      case 'panorama':
        items = panorama;
        setEmpty(VREmpty);
        break;
      case 'placePicture':
        setEmpty('暂无图片');
        items = placePicture;
        break;
      case 'placeVideo':
        setEmpty('暂无视频');
        items = placeVideo;
        break;
      default:
        setEmpty('暂无图片');
        items = placePicture;
    }
    return items;
  };
    // 根据key，处理Items
  const renderItems = (key: string, fileList: any[]) => {
    if (!fileList) {
      return [];
    }
    switch (key) {
      case 'floorPlan':
        const items = fileList.reduce((prev, next) => {
          return prev.concat(next.picture);
        }, []);
        return items.map((item, index) => (
          <Image
            key={index}
            src={QiniuImageUrl(item.url)}
            style={{ width: 400, height: 320 }}
          />
        ));
      case 'placeVideo':
        return fileList.map((item, index) => (
          <VideoPlay key={index} src={item.url} width={400} height={320} />
        ));
      case 'placePicture':
        return fileList.map((item, index) => (
          <Image
            key={index}
            src={QiniuImageUrl(item.url)}
            style={{ width: 400, height: 320 }}
          />
        ));
      case 'panorama':
        return fileList.map((item, index) => (
          <div
            style={{
              display: ' flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 400,
              height: 320,
              background: '#F6F7F9',
              cursor: 'pointer',
            }}
            key={index}
            onClick={() => window.open(item.url)}
          >
            {VREmpty}
          </div>
        ));
      default:
        return fileList.map((item, index) => (
          <Image
            key={index}
            src={QiniuImageUrl(item.url)}
            style={{ width: 400, height: 320 }}
          />
        ));
    }
  };
  useEffect(() => {
    if (!activeKey) {
      return;
    }
    const items = getItems(activeKey);
    setItems(renderItems(activeKey!, items) as any);
  }, [activeKey]);
  return <div className={styles.topContainer}>
    <Row wrap={false}>
      <Col>
        {/* 图片位置 */}
        <Slider items={items} empty={empty}>
          <ToolbarNav
            items={tItms}
            onChange={onNavChange}
            value={activeKey}
          >
          </ToolbarNav>
        </Slider>
      </Col>
      <Col flex={1} style={{ fontSize: 16 }}>
        {/* 标题 */}
        <div className={styles.title}>{placeName}</div>

        {/* 地址 */}
        <div className={styles.addressBox}>
          <Text
            ellipsis={{ tooltip: replaceEmpty(address?.address) }}
            className={styles.address}>
            {replaceEmpty(address?.address)}
          </Text>
          <Image
            width={16}
            height={17}
            preview={false}
            className={styles.infoIcon}
            onClick={() => openAMap(address?.longitude, address?.latitude, address?.address)}
            src='https://staticres.linhuiba.com/project-custom/pms/icon/location.png'
          />
        </div>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        {/* 商圈、日均客流、项目定位、项目经营面积 */}
        <Row gutter={24}>
          {topPropertyList.map((item, index) => {
            const { propertyName, value } = item;
            return (
              <div key={index}>
                <Col className='mr-40'>
                  <div className='c-222 fs-18 bold'>
                    {value}
                  </div>
                  <div className='c-666 fs-12'>
                    {propertyName}
                  </div>
                </Col>
              </div>
            );
          })}
        </Row>
        {/* 分割线 */}
        {topPropertyList.length > 0 && (
          <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        )}
        {placeDescription ? <div className={styles.contentBox}>
          <div className={styles.label}>场地描述</div>
          <Paragraph ellipsis={{ rows: 3, tooltip: placeDescription }}>
            <span className='fs-14 c-222'>{placeDescription}</span>
          </Paragraph>
        </div> : null}

        <div className={styles.contentBox}>
          <div className={styles.label}>场地评分</div>
          <div className={styles.progress}>
            <ProgressWithTitle
              key={'城市市场'}
              title='城市市场'
              percent={appraisalReport?.placeAnalysisTop?.cityMarketRatio || 0}
              config={{
                width: 57
              }}
            />
            <ProgressWithTitle
              key={'商业氛围'}
              title='商业氛围'
              percent={appraisalReport?.placeAnalysisTop?.businessClimateRatio || 0}
              config={{
                width: 57
              }}
            />
            <ProgressWithTitle
              key={'客群客流'}
              title='客群客流'
              percent={appraisalReport?.placeAnalysisTop?.customerFlowRatio || 0}
              config={{
                width: 57
              }}
            />
            <ProgressWithTitle
              key={'交通便利'}
              title='交通便利'
              percent={appraisalReport?.placeAnalysisTop?.trafficConvenientRatio || 0}
              config={{
                width: 57
              }}
            />
          </div>
        </div>

      </Col>
    </Row>
  </div>;
};
export default Top;
