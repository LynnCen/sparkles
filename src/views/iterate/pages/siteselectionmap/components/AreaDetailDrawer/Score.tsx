/**
 * @Description 商圈详情-评分栏
 *
 */
import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { beautifyThePrice, isNotEmpty } from '@lhb/func';

const Score: FC<any> = ({
  detail,
}) => {
  return (
    <div className={styles.scoreContainer}>
      <div className={styles.iconWrapper}>
        <img
          src='https://staticres.linhuiba.com/project-custom/locationpc/selectionmap/ic_business_analyse.png'
          width='100%'
          height='100%'
        />
      </div>
      <div className={cs(styles.scoreWrapper, 'ml-16')}>
        <div className={cs(styles.score, 'fs-24 c-222')}>{beautifyThePrice(detail.mainBrandsScore, ',', 0)}</div>
        <div className={cs(styles.scoreTitle, 'mt-4')}>商圈行业评分</div>
      </div>
      <div className={cs(styles.despWrapper, 'ml-12 pd-12 bg-fff')}>
        <span className='fs-14 c-222 bold'>
          {
            isNotEmpty(detail?.mainBrandsRank) ? `${detail?.districtName || ''}${detail?.firstLevelCategory || ''}排名第 ${detail?.mainBrandsRank || '-'} 名` : ''
          }
        </span>
        {isNotEmpty(detail.poiNum) ? <div className='fs-12 c-999 mt-6'>
          <span>本区域经营门店</span>
          <span className='c-222 bold'> {isNotEmpty(detail.poiNum) ? detail.poiNum : '-' } </span>
          <span>家，其中店龄超过1年的门店占比
            <span className='c-222 bold'> {isNotEmpty(detail.gtOneYearRate) ? (+detail.gtOneYearRate * 100).toFixed(1) + '%' : '-' }</span>
            ，门店经营年限适中，店龄
            <span className='c-222 bold'>超过3年</span>
            的门店业态中，
            <span className='c-222 bold'>{detail?.highestTypeGt3years || '-'}</span>
            占比最高。3年老店占比超全市
            <span className='c-ff8 bold'> {isNotEmpty(detail.threeYearSurpassRate) ? (+detail.threeYearSurpassRate * 100).toFixed(1) + '%' : '-' } </span>
            的商圈</span>
        </div> : <div style={{ height: '34px' }}></div>}
      </div>
    </div>
  );
};

export default Score;
