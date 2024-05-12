import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import { Card } from 'antd';
import { FC } from 'react';
import styles from './index.module.less';

const RevenueEstimate:FC<any> = ({ data, paymentCost, guaranteedSale }: any) => {
  const incomeTable = [
    { name: '系统预测销售额', value: data.systemEstimatedSale || '-', unit: '(元/天)' },
    { name: '人工预测销售额', value: data.estimatedSale || '-', unit: '(元/天)' },
    { name: '租期总利润', value: data.totalProfitDuringRent || '-', unit: '(万元)' },
    { name: '成本支出', value: paymentCost || '-', unit: '(元/年)' },
    { name: '保本销售额', value: guaranteedSale || '-', unit: '(元/天)' },
  ];

  return (
    <Card className={styles.incomeCard}>
      <TitleTips className={styles.titleTips} name='收入预估' showTips={false} />
      <div className={styles.simplyTable}>
        { incomeTable.map((item, index) => (
          <div className={styles.tableItem} key={index}>
            <div className={styles.header}>{ item.name }<br /><span className={styles.unit}>{ item.unit }</span></div>
            <div className={styles.body}>{ item.value }</div>
          </div>
        )) }
      </div>
    </Card>
  );
};

export default RevenueEstimate;
