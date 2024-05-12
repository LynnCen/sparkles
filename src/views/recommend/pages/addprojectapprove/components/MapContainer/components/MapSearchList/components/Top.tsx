/**
 * @Description 顶部部分
 */
import { FC } from 'react';
import styles from '../index.module.less';

const Top: FC<any> = ({
  detailData, // 详情
  approvalDetail,
  totalInfo, // 总商圈个数和已开门店个数
}) => {

  return (
    <div className={styles.topSection}>
      <div className={styles.title}>
        {approvalDetail.name}
      </div>
      {
        detailData?.visible
          ? <></>
          : <div className={styles.countCon}>
              本次添加<span className='bold c-006 fs-14'> {totalInfo || '-'} </span>商圈,
            <span className='c-666'>
              (已规划<span className='fs-14'> {approvalDetail?.formData?.planClusterAddPlannedFormData?.childCompanyPlannedClusterNum || '-'} </span>个商圈)
            </span>
          </div>
      }
    </div>
  );
};

export default Top;
