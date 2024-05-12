/**
 * @Description 目标进度卡片
 */
import { FC, useEffect, useState } from 'react';
import {
  Tooltip,
  Row,
  Col,
  Progress,
  Skeleton
} from 'antd';
import { scheduleOverview } from '@/common/api/yhtang';
// import cs from 'classnames';
import styles from '../entry.module.less';
import IconFont from '@/common/components/IconFont';

const CardItem: FC<any> = ({
  data
}) => {

  return (<div className={styles.cardItem}>
    {
      data ? <>
        <div className='c-666 fs-16'>
          <span className='pr-6'>{data?.name || '-'}</span>
          <Tooltip
            placement='top'
            overlayInnerStyle={{
              fontSize: '12px'
            }}
            title={data?.placeHolder || data?.name || '-'}>
            <span>
              <IconFont
                iconHref='iconquestion-o'
                className='c-999 fs-14' />
            </span>
          </Tooltip>
        </div>
        <Row
          className='mt-12'
          align='middle'>
          <Col span={12} className='fs-24 c-333'>{ data?.result || '-' }</Col>
          <Col span={12} className='fs-12 c-666 rt'>{data?.resultDetail}</Col>
        </Row>
        <Progress
          strokeColor={{
            '0%': '#00C7FF',
            '100%': '#006AFF',
          }}
          percent={parseFloat(data?.result)}
          showInfo={false}
          className='mt-6'/>
      </> : <Skeleton/>
    }
  </div>
  );
};

const ScheduleCards: FC<any> = ({
  searchParams
}) => {
  const [cardsData, setCardsData] = useState<any[]>([
    undefined,
    undefined,
    undefined,
  ]);

  useEffect(() => {
    const { start, end } = searchParams;
    if (!(start && end)) return;
    loadData();
  }, [searchParams]);

  const loadData = () => {
    scheduleOverview(searchParams).then((data) => {
      const {
        targetRate,
        planSpotRate,
        thisYearTargetRate
      } = data;
      setCardsData([
        targetRate,
        planSpotRate,
        thisYearTargetRate
      ]);
    });
  };

  return (
    <div className={styles.cardsCon}>
      {
        cardsData.map((card: any, index: number) => <CardItem key={index} data={card}/>)
      }
    </div>
  );
};

export default ScheduleCards;

