import NotFound from '@/common/components/NotFound';
import styles from './entry.module.less';

const Situation = () => {
  return (
    <div className={styles.container}>
      <NotFound text='功能规划中，敬请期待！' imgClassName={styles.images} textClassName={styles.text} />
    </div>
  );
};

export default Situation;
