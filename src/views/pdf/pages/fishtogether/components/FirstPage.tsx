import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import { replaceEmpty } from '@lhb/func';
const firstPage: FC<any> = ({
  res = {}
}) => {
  return (
    <div className={cs(styles.coverPage, styles.firstPage)}>
      <div className={styles.firstPageTitle}>
        <div className={styles.firstPageTitleWrapper}>
          <div className={styles.firstPageAddress}>{(res.shopName || '').slice(0, 36)}</div>
          <div className={styles.firstPageTip}>选址过会报告</div>
          <div className={styles.firstPageText}>{res.branchOffice}—{res.manager}</div>
          <div className={styles.firstPageText}>提报日期：{replaceEmpty(res.reportedAt)}</div>
        </div>
      </div>
      <div className={styles.coverPageDivider}></div>
      <img className={styles.coverPageLogo} src={require('@/assets/images/fishtogether/logo.png')} alt='logo'/>
    </div>
  );
};

export default firstPage;
