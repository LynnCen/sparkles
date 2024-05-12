/*
* 顶部详情
*/
import { FC } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Tag from '@/common/components/Data/V2Tag';
import V2Flex from '@/common/components/Feedback/V2Flex';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import { Image, Col } from 'antd';
import styles from './entry.module.less';
import V2Empty from '@/common/components/Data/V2Empty';
import { isNotEmpty } from '@lhb/func';
// import { QiniuImageUrl } from '@/common/utils/qiniu';
import SlideMedia from '@/common/components/SlideMedia';

interface TopProps{
  placeInfo?:any
}

const PlaceMngDrawerTop:FC<TopProps> = ({
  placeInfo
}) => {
  const STREET_SHOPS = 140;


  return (
    <div className={styles.container}>
      <V2Flex>
        {
          isNotEmpty(placeInfo.placePictures)
            ? <>
              <SlideMedia images={placeInfo.placePictures} width='320px' height='240px'/>
            </>
            : <V2Empty className={styles.emptyImage}/>
        }
        <div className={styles.context}>
          <div className={styles.top}>
            <V2Title className={styles.title}>
              <a style={{ color: '#006AFF', textDecorationLine: 'none' }} onClick={() => {
                window.open(`${window.location.origin}/resmng/real-detail?id=${placeInfo.publicId}&resourceType=${0}&categoryId=${placeInfo.categoryId}&isKA=false`);
              }}>
                {placeInfo.name}
              </a>
              {placeInfo.categoryId !== STREET_SHOPS && placeInfo.tag && placeInfo.tag.length ? <V2Tag color='orange' className={styles.tag}>{placeInfo.tag}</V2Tag> : ''}
            </V2Title>
          </div>
          <div className={styles.erweimaImage}>
            <Image src={placeInfo.qrCode } style={{ width: '50px', height: '50px' }}/>
          </div>
          <V2DetailGroup className={styles.detail} direction='horizontal'>
            <Col span={7}>
              <V2DetailItem label='铺位类型' value={placeInfo.categoryName}/>
            </Col>
            <Col span={7}>
              <V2DetailItem label='招商业态' value={placeInfo.commercialNames?.join('、')}/>
            </Col>
            {
              placeInfo.categoryId !== STREET_SHOPS
                ? <Col span={7}>
                  <V2DetailItem label='开业时间' value={placeInfo.openDate}/>
                </Col>
                : ''
            }

          </V2DetailGroup>
          <V2DetailGroup className={styles.detail} direction='horizontal'>
            {
              placeInfo.categoryId === STREET_SHOPS
                ? <>
                  <Col span={7}>
                    <V2DetailItem label='面积' value={placeInfo.specLW[0] ? `${placeInfo.specLW[0]?.w}*${placeInfo.specLW[0]?.l}m²` : ''}/>
                  </Col>
                  <Col span={7}>
                    <V2DetailItem label='租金' value={`${placeInfo.rentmonth?.value || ''}${placeInfo.rentmonth?.suffix || ''}`}/>
                  </Col>
                </>
                : <>
                  <Col span={7}>
                    <V2DetailItem label='商业体量' value={placeInfo.commercialVolume
                      ? isNaN(placeInfo.commercialVolume) ? placeInfo.commercialVolume : placeInfo.commercialVolume + 'm²'
                      : '-'}/>
                  </Col>
                  <Col span={7}>
                    <V2DetailItem label='日均客流' value={placeInfo.dailyFlow}/>
                  </Col>
                </>
            }
          </V2DetailGroup>
          <V2DetailGroup className={styles.placeDescription} direction='horizontal'>
            <V2DetailItem label={placeInfo.categoryId === STREET_SHOPS ? '铺位亮点：' : '项目亮点：'} value={placeInfo.placeDescription}/>
          </V2DetailGroup>
        </div>
      </V2Flex>
    </div>
  );
};


export default PlaceMngDrawerTop;
