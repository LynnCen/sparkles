/**
 * @Description 点位Item
 */

import { FC, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { UrlSuffix } from '@/common/enums/qiniu';
import Entrance from '@/views/iterate/pages/siteselectionmapb/components/CreateFavorite/Entrance';
import cs from 'classnames';
import styles from './index.module.less';
import EmptyImg from 'src/common/components/Empty/Img';

const Item = ({
  label,
  value,
  className = ''
}) => {
  return <div className={cs(styles.itemComCon, 'fs-14', className)}>
    <div className='c-666'>{label}</div>
    <div className='c-222 bold'>{value || '-'}</div>
  </div>;
};

const PointItem: FC<any> = ({
  item,
  clusterId,
  setPointDrawerData,
  setDetailIsShow,
}) => {
  const { isFavourate } = item;
  const [collectStatus, setCollectStatus] = useState(isFavourate);
  const targetImg = useMemo(() => {
    const { pic } = item;
    if (pic) return `${pic}${UrlSuffix.Ori}`;
    return '';
  }, [item]);

  useEffect(() => {
    setCollectStatus(!!item?.isFavourate);
  }, [item]);
  return (
    <div className={styles.pointItemCon} onClick={() => {
      setPointDrawerData({
        open: true,
        pointId: item?.id,
        businessId: clusterId
      });
      setDetailIsShow && setDetailIsShow(true);
    }}>
      <div className={styles.pointImgCon}>
        {
          targetImg ? <img src={targetImg} width='100%' height='100%' /> : <EmptyImg/>
        }
      </div>
      <div className={cs('ml-12', styles.contentCon)}>
        <Row>
          <Col span={21}>
            <div className={cs('fs-14 c-222 bold', styles.titleText)}>
              {item.name}
            </div>
            <div className='c-666 fs-12 mt-6 ellipsis' title={item.introduction}>
              {item.introduction}
            </div>
          </Col>
          <Col span={3}>
            <Entrance
              spotId={item.id}
              collectStatus={collectStatus}
              setCollectStatus={setCollectStatus}
            />
          </Col>
        </Row>
        <div className={cs(styles.briefCon, 'mt-8')}>
          <Row gutter={20}>
            <Col span={8}>
              <Item label='所在楼层：' value={item.floor}/>
              <Item className='mt-10' label='位置类型：' value={item.locationType}/>
            </Col>
            <Col span={8}>
              <Item label='展位面积：' value={item.area}/>
              <Item className='mt-10' label='经营时间：' value={item.openTime}/>
            </Col>
            <Col span={8}>
              <Item label='工作日客流：' value={item.dayFlow}/>
              <Item className='mt-10' label='节假日客流：' value={item.holidayFlow}/>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PointItem;
