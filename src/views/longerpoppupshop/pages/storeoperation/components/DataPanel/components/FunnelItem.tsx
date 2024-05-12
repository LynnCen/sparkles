import {
  FC,
  // useEffect,
  // useState,
} from 'react';
import { beautifyThePrice } from '@lhb/func';
import { valueFormat } from '@/common/utils/ways';
import cs from 'classnames';
import styles from '../../../entry.module.less';
import IconFont from '@/common/components/IconFont';

const FunnelItem: FC<any> = ({
  isFirst = false, // 是否是第一个漏斗
  data = {}
}) => {
  return (
    <div className={cs(styles.funnelItemCon, 'mt-12')}>
      <div className={styles.explainCon}>
        <div className={styles.textCon} style={{ background: data.leftBg }}>
          <div className='c-172 fs-14'>
            <span className='bold fs-14'>{valueFormat(data.cost)}</span><span className='fs-12'>元/人</span>
            <span className='pl-6 fs-12'>(单位成本)</span>
          </div>
          <div className='mt-5 c-959 fs-12'>
            {valueFormat(beautifyThePrice(data.count, ','))}人
            <span className={cs('pl-8', data.countRatio >= 0 ? 'color-danger' : 'c-52c')}>
              （
              <IconFont iconHref='iconcaret-bottom' className={cs(data.countRatio >= 0 ? styles.overturn : '')}/>
              <span className='pl-4'>较全国 {valueFormat(data.countRatio)}%</span>
              ）
            </span>
          </div>
        </div>
        <div className={styles.placeholderCon}>
          <div
            className={styles.distinctionCon}
            style={{
              width: data.width,
              borderTopColor: data.rightBg,
              borderRightWidth: data.borderWidth
            }}>
            <div
              className={styles.titleText}
              style={{
                left: data.textLeft
              }}>
              {data.name}
            </div>
          </div>
        </div>
      </div>
      {
        isFirst ? null : (
          <div className={styles.comparisonCon}>
            <div className={styles.displacementCon}>
              <div className={styles.branchBoxCon}>
                <img
                  src='https://staticres.linhuiba.com/project-custom/locationpc/new/img_displacement@2x.png'
                  width='100%'
                  height='100%'/>
              </div>
              <div className={styles.dataCon}>
                <div>
                  <div className='c-132'>
                    <span className='fs-14'>
                      <span className='bold'>{valueFormat(data.ratio)}</span>%
                    </span>
                    <span className='pl-4 fs-12'>{data.ratioName}</span>
                  </div>
                  <div className={cs('mt-5 fs-12', data.nationwideRatio >= 0 ? 'color-danger' : 'c-52c')}>
                    (<IconFont iconHref='iconcaret-bottom' className={cs('fs-12', data.nationwideRatio >= 0 ? styles.overturn : '')}/>
                    <span className='pl-4'>较全国{valueFormat(data.nationwideRatio)}%</span>)
                  </div>
                </div>
                <div className='ml-16'>
                  <IconFont iconHref={data.iconHref} className='fs-30'/>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default FunnelItem;
