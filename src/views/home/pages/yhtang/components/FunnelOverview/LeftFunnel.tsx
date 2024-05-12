/**
 * @Description 网规漏斗
 */

import { FC } from 'react';
import { Tooltip, Skeleton } from 'antd';
import { beautifyThePrice, isArray } from '@lhb/func';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const LeftFunnel: FC<any> = ({
  data
}) => {

  return (
    <div className={styles.leftCon}>
      {
        isArray(data) && data.length > 0 ? (<div>
          {
            data.map((item: any, index: number) => (
              <div key={index} className={styles.funnelItem}>
                <div
                  className={styles.isoscelesTrapezoid}
                  style={{
                    width: item.width,
                    opacity: item.opacity
                  }}>
                  <div className={cs(styles.explainCon, 'fs-16 color-white font-weight-500')}>
                    <span className='pr-4'>{item.name}</span>
                    <Tooltip
                      placement='top'
                      overlayInnerStyle={{
                        fontSize: '12px'
                      }}
                      title={item.placeHolder}>
                      <span>
                        <IconFont
                          iconHref='iconquestion-o'
                          className={cs(styles.tooltipIcon, 'fs-14')} />
                      </span>
                    </Tooltip>
                  </div>
                </div>
                <div
                  className={styles.explainValCon}
                  style={{
                    marginRight: item.valMarginRight
                  }}>
                  <div className={cs(styles.valCon, 'bold fs-22 c-333')}>
                    {beautifyThePrice(item.result, ',', 0)}
                  </div>
                </div>
              </div>
            ))
          }
        </div>)
          : <Skeleton
            active
            title={false}
            paragraph={{
              rows: 5,
              width: 400
            }}
            style={{ width: '400px' }}/>
      }
    </div>
  );
};

export default LeftFunnel;
