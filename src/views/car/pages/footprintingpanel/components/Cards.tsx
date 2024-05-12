import FootPrintCard from '@/common/components/business/FootPrintCard';
import { post } from '@/common/request';
import { Row } from 'antd';
import { FC, useEffect, useState } from 'react';

const Cards: FC<any> = () => {
  const [count, setCount] = useState<any>({});

  const loadCount = async () => {
    post('/checkSpot/project/overview').then((res) => {
      setCount(res || {});
    });
  };

  useEffect(() => {
    loadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numberFormat = (n: any) => {
    if (n === 0) {
      return '0';
    }
    return n || '-';
  };
  return (
    <Row gutter={[12, 12]} style={{ minHeight: '200px' }}>
      <FootPrintCard
        key={1}
        count={numberFormat(count.notStartProjectCount)}
        icon={'iconic_daicairenwu'}
        title={'待踩任务（个）'}
      />
      <FootPrintCard
        key={2}
        count={numberFormat(count.completeProjectCount)}
        icon={'iconic_yicairenwu'}
        title={'已踩任务（个）'}
      />
      <FootPrintCard
        key={3}
        count={numberFormat(count.doingProjectCount)}
        icon={'iconic_caidianzhong'}
        title={'踩点中（个）'}
      />
      <FootPrintCard key={4} count={numberFormat(count.projectCount)} icon={'iconic_leijicaidian'} title={'累计踩点（个）'} />
      <FootPrintCard
        key={5}
        count={numberFormat(count.durationHour)}
        icon={'iconic_caidianzongshichang'}
        title={'踩点总时长（h）'}
      />
      <FootPrintCard
        key={6}
        count={numberFormat(count.aveDurationHour)}
        icon={'iconic_pingjuncaidianshichang'}
        title={'平均踩点时长（h）'}
      />
      <FootPrintCard key={7} count={numberFormat(count.aveFlow)} icon={'iconic_rijunkeliu'} title={'日均客流（人次）'} />
      <FootPrintCard key={8} count={numberFormat(count.aveCpm)} icon={'iconic_cpm'} title={'平均CPM（元）'} />
    </Row>
  );
};

export default Cards;
