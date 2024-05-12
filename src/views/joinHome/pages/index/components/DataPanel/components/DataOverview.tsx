import { FC } from 'react';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import styles from '../../../entry.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
// 数据概览
const Component:FC = () => {

  const dataList = [
    { label: '新开门店：', value: '1,469' },
    { label: '开店完成率：', value: '68.74%' },
    { label: '落位总数：', value: '1,916' },
    { label: '平均落位周期：', value: '35天' },
    { label: '新增点位数：', value: '15,705' },
    { label: '点位上报完成率：', value: '87.91%' },
    { label: '覆盖省份：', value: '27省' },
    { label: '新进省份：', value: '2省' },
    { label: '覆盖城市：', value: '251个' },
    { label: '新进城市：', value: '12个' },
  ];
  const labelStyle = {
    marginRight: 0,
    textAlign: 'right' as const,
  };
  const valueStyle = {
    fontSize: '12px',
  };
  return <div className={styles.dataOverview}>
    <TitleTips
      name='全国数据概览'
      showTips={false}
      className={styles.titleTips}
    />
    <V2DetailGroup direction='horizontal' labelLength={9} moduleType='easy' className={styles.detailGroup}>
      {
        dataList.map((item, index) => <V2DetailItem
          label={item.label}
          value={item.value}
          labelStyle={labelStyle}
          valueStyle={valueStyle}
          key={index}
          className={styles.detailItem}
        />)
      }
    </V2DetailGroup>
    <TitleTips
      name='全国门店概况'
      showTips={false}
      className={styles.titleTips}
    />
    <img
      src={'https://staticres.linhuiba.com/project-custom/locationpc/join/join_home_chart.svg'}
      className={styles.dataOverviewChart}
    ></img>
  </div>;
};

export default Component;
