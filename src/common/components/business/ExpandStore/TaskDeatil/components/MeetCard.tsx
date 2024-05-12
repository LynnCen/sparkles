/**
 * @Description 沟通记录每一项
 */

import { dateFns } from '@lhb/func';
import { FC } from 'react';
import styles from '../index.module.less';
import V2DetailItem from '@/common/components/Feedback/V2DetailItem';
import V2DetailGroup from '@/common/components/Feedback/V2DetailItem/Group';
const MeetCard:FC<any> = ({
  detail
}) => {
  const buildAssets = (fileList) => {
    if (Array.isArray(fileList) && fileList.length) {
      return fileList.map((item) => ({
        url: item,
        name: '',
      }));
    }
    return [];
  };
  return <div className={styles.meetCardCon}>
    <div className={styles.date}>
      {/* 日期 */}
      <div
        className={styles.dateTop}
      >{dateFns.getDateYearMonthDay(detail?.communicateAt)?.day}</div>
      {/* 年.月 */}
      <div
        className={styles.dateBottom}
      >{
          `${dateFns.getDateYearMonthDay(detail?.communicateAt)?.year}.${dateFns.getDateYearMonthDay(detail?.communicateAt)?.month}`
        }</div>
    </div>
    <div className={styles.record}>
      <div className={styles.title}>{detail?.name}</div>
      <div className={styles.content}>{detail?.content}</div>
      {buildAssets(detail?.fileList).length
        ? <V2DetailGroup moduleType='easy' className='mt-8 mb-6'>
          <V2DetailItem type='images' assets={buildAssets(detail?.fileList)} noStyle/>
        </V2DetailGroup>
        : <></>
      }
    </div>
  </div>;
};
export default MeetCard;
