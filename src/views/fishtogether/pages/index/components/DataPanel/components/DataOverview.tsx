// import { FC } from 'react';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import styles from '../../../entry.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
import RatioPieChart from './RatioPieChart';
// 数据概览
const Component: any = ({ nationalDate }) => {
  const dataList = [
    { label: '新开门店：', value: nationalDate?.shopOpenCount },
    { label: '落位总数：', value: nationalDate?.contractAgreeCount },
    { label: '平均落位周期：', value: nationalDate?.avgContractAgreePeriod },
    { label: '落位计划完成率：', value: nationalDate?.contractPlanRate },
    { label: '覆盖省份：', value: nationalDate?.coveredProvinceCount },
    { label: '覆盖城市：', value: nationalDate?.coveredCityCount },
  ];
  const labelStyle = {
    marginRight: 0,
    textAlign: 'right' as const,
  };
  const valueStyle = {
    fontSize: '12px',
  };
  return (
    <div className={styles.dataOverview}>
      <TitleTips name='全国数据概览' showTips={false} className={styles.titleTips} />
      <V2DetailGroup direction='horizontal' labelLength={9} moduleType='easy' className={styles.detailGroup}>
        {dataList.map((item, index) => (
          <V2DetailItem
            label={item.label}
            value={item.value || '-'}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            key={index}
            className={styles.detailItem}
          />
        ))}
      </V2DetailGroup>
      <TitleTips name='全国门店概况' showTips={false} className={styles.titleTips} />
      <RatioPieChart />
    </div>
  );
};

export default Component;
