/**
 * @Description 门店分布模块
 */
import { FC, useState } from 'react';
import styles from './index.module.less';
import { replaceEmpty } from '@lhb/func';
import SwitchRadio from '../SwitchRadio';
import { Table } from 'antd';
import { useMethods } from '@lhb/hook';
import { v4 } from 'uuid';

const RightCon:FC<any> = ({
  data = {}
}) => {
  const [type, setType] = useState<String>('provinceCountList');
  const defaultColumns = [
    {
      dataIndex: type === 'provinceCountList' ? 'provinceName' : 'cityLevelName',
      title: type === 'provinceCountList' ? '省份名称' : '城市等级名称',
      width: 140 },
    { dataIndex: 'shopCount', title: '门店数', width: 120 },
    { dataIndex: 'rate', title: '占比', width: 120, render: (text) => replaceEmpty(text) + '%' },
  ];

  const options: any[] = [
    { label: '省份', value: 'provinceCountList' },
    { label: '城市等级', value: 'cityLevelCountList' },
  ];

  const methods = useMethods({
    changeType(e) {
      setType(e.target.value);
    }
  });

  return <div className={styles.right}>
    <div className={styles.top}>
      <div className={styles.storeCard}>
        <span className={styles.storeCardValue}>{replaceEmpty(data.shopCount)}</span>
        <span className={styles.storeCardTitle}>在营门店数</span>
      </div>
      <div className={styles.storeCard}>
        <span className={styles.storeCardValue}>{replaceEmpty(data.cityCount)}</span>
        <span className={styles.storeCardTitle}>覆盖城市</span>
      </div>
      <div className={styles.storeCard}>
        <span className={styles.storeCardValue}>{replaceEmpty(data.provinceCount)}</span>
        <span className={styles.storeCardTitle}>覆盖省份</span>
      </div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.title}>排名</div>
      <SwitchRadio
        type='default'
        defaultValue={type}
        config={{
          value: type,
          size: 'small'
        }}
        onChange={methods.changeType}
        options={options} />
    </div>
    <Table
      scroll={{ y: 460 }}
      columns={defaultColumns}
      className={styles.table}
      pagination={false}
      dataSource={data[type as keyof typeof data]}
      rowKey={() => v4()}
    />
  </div>;
};
export default RightCon;
