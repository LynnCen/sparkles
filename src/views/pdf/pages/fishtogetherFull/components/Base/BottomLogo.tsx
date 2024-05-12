import { FC } from 'react';
import styles from './index.module.less';
const BottomLogo: FC<any> = () => {
  return (
    <div className={styles.bottomLogo}>
      <img className={styles.bottomLogoImg} src={require('@/assets/images/fishtogether/logo-small.png')} alt='logo'/>
      <div className={styles.bottomLogoText}>「品牌愿景」成为全球中式快餐万店榜首</div>
    </div>
  );
};

export default BottomLogo;
