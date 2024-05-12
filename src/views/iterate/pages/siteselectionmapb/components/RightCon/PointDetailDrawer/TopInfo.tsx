/**
 * @Description
 */
import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import LabelRow from '@/views/iterate/pages/siteselectionmap/components/AreaDetailDrawer/LabelRow';
import V2Title from '@/common/components/Feedback/V2Title';
import { Carousel, Col, Row, Image } from 'antd';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import { QiniuImageUrl } from '@/views/car/pages/resourcedetail/utils';
import { bigdataBtn } from '@/common/utils/bigdata';
import Entrance from '../../CreateFavorite/Entrance';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import cs from 'classnames';
import EmptyImg from 'src/common/components/Empty/Img';

const TopInfo:FC<any> = ({
  data,
  pointDrawerData,
  // setPointDrawerData,
  setDrawerData,
  drawerData, // 商圈详情抽屉
}) => {
  const [collectStatus, setCollectStatus] = useState(data?.isFavourate);
  useEffect(() => {
    setCollectStatus(!!data?.isFavourate);
  }, [data]);
  const detail = [
    { label: '点位名称', value: data?.name },
    { label: '室内/室外', value: data?.indoor },
    { label: '活动时间', value: data?.openTime },
    { label: '限高(m)', value: data?.heightLimit },
    { label: '点位周边品牌', value: data?.brand },
    { label: '允许承重', value: data?.WeightLimit },
    { label: '展示方向', value: data?.directions },
    { label: '具体位置', value: data?.detailedLocation },
    { label: '禁摆品类', value: data?.banTypes },
    { label: '物业要求', value: data?.requirements },
    { label: '工作日客流', value: data?.dayFlow },
    { label: '节假日客流', value: data?.holidayFlow },
  ];

  const jumpToTarget = () => {
    const { serviceId } = data;
    if (!serviceId) {
      V2Message.warning('数据异常，未获取到资源id');
      return;
    }
    window.open(`${process.env.LINHUIBA_ADMIN}lhb-micro-pms/pointMng/detail?tenantSpotId=${serviceId}`);
    // https://lhb.lanhanba.com/#/lhb-micro-pms/pointMng/detail?tenantSpotId=40474
  };

  return <div className={styles.topInfo}>
    <div className={styles.topCon}>
      {/* 轮播图 */}
      {data?.pics?.length ? <div className={styles.imgCon} onClick={() => {
        bigdataBtn('66a46fb1-017e-4ce8-8e0e-fb5016e1bcce', '选址地图', '点位详情-图片', '点击点位详情-图片');
      }}>
        <Carousel autoplay>
          {
            data?.pics?.map((url, index) => <Image
              key={index}
              src={QiniuImageUrl(url)}
              width={300}
              height={240}
            />
            )
          }
        </Carousel>
      </div> : <EmptyImg className={styles.emptyCon}/>}
      <div className={styles.rightDetail}>
        <div className={styles.topTitle}>
          <span className={styles.text}>{data?.clusterName}{data?.clusterName && data?.name ? '-' : ''}{data?.name}</span>
          <span className={styles.btns}>
            {data?.orderAndCase ? <span className={styles.caseBtn} onClick={jumpToTarget}>案例及订单</span> : <></>}
            <span className={'inline-block'}>
              <Entrance
                eventId='c6e0f5c6-fd35-446f-a63b-9d34958f2aa0'
                spotId={pointDrawerData.pointId}
                collectStatus={collectStatus}
                setCollectStatus={setCollectStatus}
                wrapperClassName={styles.iconCon}
                iconClassName={styles.icon}
              />
            </span>
          </span>
        </div>
        <LabelRow id={pointDrawerData.businessId}/>
        <div className={styles.infoCard}>
          {data?.floor ? <div>
            <div className={styles.text}>点位楼层</div>
            <div className={styles.value}>{data?.floor}</div>
          </div> : <></>}
          {data?.locationType ? <div>
            <div className={styles.text}>位置类型</div>
            <div className={styles.value}>{data?.locationType}</div>
          </div> : <></>}
          {data?.area ? <div>
            <div className={styles.text}>规格（长宽）</div>
            <div className={styles.value}>{data?.area || '-'}</div>
          </div> : <></> }
          {data?.times ? <div>
            <div className={styles.text}>使用次数</div>
            <div>
              <span className={styles.value}> {data?.times || '-'}次</span>
              {data?.timesRank && data?.timesRank < 50
                ? <span className={styles.label}>市内商场排名第{data?.timesRank}</span>
                : <></>}
            </div>
          </div> : <></>}
        </div>
        <div className='mt-16 fs-14'>
          <span className='c-666'>所属项目</span>
          <span
            className={cs('ml-8', data?.clusterName && !drawerData?.open ? 'pointer c-006' : '')}
            onClick={() => {
              // 当不存在clusterName或者抽屉已打开时不处理点击事件
              if (!data?.clusterName || drawerData?.open) return;
              setDrawerData({
                open: true,
                id: pointDrawerData.businessId
              });
            }}
          >
            {data?.clusterName || '-'}</span>
        </div>

        <div className='mt-12 fs-14'>
          <span className='c-666'>展位描述</span>
          <span className='ml-8 c-222'>
            {data?.introduction || '-'}</span>
        </div>
        <div>

        </div>
      </div>

    </div>

    <V2Title divider type='H2' text='基本信息' className='mt-16'/>
    <Row gutter={16}>
      {
        detail.map((item, index) => <Col span={8} key={index}>
          <V2DetailItem label={item.label} value={item.value}/>
        </Col>)
      }

    </Row>

  </div>;
};
export default TopInfo;
