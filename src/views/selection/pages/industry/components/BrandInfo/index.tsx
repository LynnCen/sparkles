/**
 * @Description 品牌信息
 */
import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import CardItem from './components/CardItem';
import BrandRank from './components/BrandRank';

const BrandInfo: FC<any> = ({
  brand,
  month
}) => {

  return (
    <>
      {/* 概览 */}
      <div className={cs('mt-14', styles.sectionCon)}>
        <div className={styles.flexCon}>
          <CardItem item={{
            label: '全国网点总数',
            value: brand?.total
          }}/>
          <CardItem item={{
            label: '覆盖省份',
            value: brand?.provinceCount
          }}/>
        </div>
        <div className={styles.flexCon}>
          <CardItem item={{
            label: '当月新增门店',
            value: brand?.monthAdded
          }}/>
          <CardItem item={{
            label: '覆盖城市',
            value: brand?.cityCount
          }}/>
        </div>
      </div>
      {/* 排名 */}
      <BrandRank brandId={brand?.id} month={month}/>
    </>
  );
};

export default BrandInfo;

