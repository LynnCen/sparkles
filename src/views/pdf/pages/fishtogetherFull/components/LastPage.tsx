import { FC } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
const LastPage: FC<any> = () => {
  return (
    <div className={cs(styles.coverPage, styles.lastPage)}>
      <div className={styles.lastPageTitle}>
        <div className={styles.thanks}>Thanks</div>
        <div className={styles.lastInfo}>
          <div className={styles.lastInfoLabel}>联系电话</div>
          <div>400-807-6277</div>
        </div>
        <div className={styles.lastInfo}>
          <div className={styles.lastInfoLabel}>联系地址</div>
          <div>中国·北京</div>
        </div>
      </div>
      <div className={styles.coverPageDivider}></div>
      <img className={styles.coverPageLogo} src={require('@/assets/images/fishtogether/logo.png')} alt='logo'/>
    </div>
  );
};

export default LastPage;
