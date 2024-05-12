import {
  FC,
  // useEffect,
  // useState,
} from 'react';
import { valueFormat } from '@/common/utils/ways';
import cs from 'classnames';
import styles from '../../../entry.module.less';
import IconFont from '@/common/components/IconFont';
import { beautifyThePrice, isNotEmpty } from '@lhb/func';

const FunnelItem: FC<any> = ({
  data = {},
  style = {}
}) => {
  return (
    <div className={cs(styles.funnelItemCon)} style={style}>
      <div className={styles.explainCon}>
        <div className={styles.textCon} style={{ background: data.leftBg }}>
          <div className={cs(styles.number, data.countRatio ? '' : 'mt-8')}>
            <span className='bold fs-14'>{beautifyThePrice(data.number, ',', 0)}</span>
          </div>
          {
            isNotEmpty(data.countRatio) && <div className={cs(data.countRatioRed ? 'color-danger' : 'c-52c', styles.ratio)}>
              <IconFont iconHref='iconcaret-bottom' className={cs(data.countRatioRed ? styles.overturn : '')}/>
              <span>通过率 {valueFormat(data.countRatio)}</span>
            </div>
          }

        </div>

        <div
          className={styles.distinctionCon}
          style={{
            width: data.width,
            borderTopColor: data.rightBg,
            borderRightWidth: data.borderWidth
          }}>
          <div className={styles.titleText}>{data.name}</div>
        </div>
      </div>
    </div>
  );
};

export default FunnelItem;
