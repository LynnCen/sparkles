/**
 * @Description
 */
/**
 * @Description label信息
 */
import { FC } from 'react';
import styles from './index.module.less';

import cs from 'classnames';
import IconFont from '@/common/components/IconFont';
import { Status } from '../../../../ts-config';

const Card:FC<any> = ({
  detail,
  marker
}) => {
  const close = () => {
    marker?.setContent(` `);
  };
  return <div className={styles.labelBox}>
    <div className={styles.title}>
      <span className={styles.titleText}>{detail?.name}</span>
      <IconFont iconHref='iconic_fail' className={styles.closeIcon} onClick={() => { close(); }}/>
    </div>
    <div className={styles.content}>
      <div className={styles.top}>
        <div>
          <div className={styles.label}>门店状态</div>
          <div className={cs(styles.textValue, [Status.SIGNED, Status.DELIVERY_HOUSE, Status.START_BUSINESS].includes(detail?.status) ? styles.open : styles.relieve)}>
            {detail?.statusName || '-'}
          </div>
        </div>
        <div>
          <div className={styles.label}>门店类型</div>
          <div className={styles.textValue}>{detail?.businessType || '-'}</div>
        </div>
      </div>


      <div className={styles.bottom}>
        <div className={styles.label}>门店地址</div>
        <div className={styles.address}>{detail?.address || '-'}</div>
      </div>
    </div>
  </div>;
};
export default Card;
