/**
 * @Description 城市信息
 */

import { FC, ReactNode } from 'react';

import styles from '../index.module.less';
import IconFont from '@/common/components/IconFont';

interface CityInfoProps {
  /** 集客点名 */
  name: string;
  /** 城市 */
  city: string;
   /** 区 */
  district: string;
  /** 二级类目 */
  secondLevelCategory: string;
  /** 一级类目 */
  firstLevelCategory: string;
  /** 推荐门店 */
  recommendStores: number;
  /** 已开门店 */
  openStores: number;
  /** 已录集客点 */
  relationStores: number;
  /** 三级类目 */
  thirdLevelCategory:string;
}



interface InfoItemProps { // 显示参数
  label: string;
  content: ReactNode;
}

/** 组件入参 */
interface Props {
  /** 集客点详情 */
  detail:CityInfoProps;
}

const renderInfoItem: FC<InfoItemProps> = ({ label, content }) => (
  <div className={styles.item}>
    <span className={styles.label}>{label}</span>
    <span className={styles.content}>{content || '-'}</span>
  </div>
);

// 集客点商圈信息
const CityInfo: FC<Props> = ({ detail }) => {

  const displayCategory = detail.thirdLevelCategory || detail.secondLevelCategory || detail.firstLevelCategory || '-';

  return (
    <div className={styles.cityInfo}>
      <div className={styles.districtName}>
        {detail.name}
        <div className={styles.dostrictPosition}>
          <IconFont iconHref='iconic_didian' className={styles.icon} />
          {`${detail.city}` + `${detail.district}`}
        </div>
      </div>

      <div className={styles.info}>
        {renderInfoItem({ label: '商圈业态', content: displayCategory })}
        {renderInfoItem({ label: '推荐门店', content: detail.recommendStores })}
        {renderInfoItem({ label: '已开门店', content: detail.openStores })}
        {renderInfoItem({ label: '已录集客点', content: detail.relationStores })}
      </div>
    </div>
  );
};

export default CityInfo;


