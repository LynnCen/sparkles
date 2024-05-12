/**
 * @Description 客流画像客流统计
 */
import IconFont from '@/common/components/IconFont';
import styles from './index.module.less';
import cs from 'classnames';
import { beautifyThePrice } from '@lhb/func';

const StatisticsFlowCard = () => {
  // TODO crq: 砍了，后面要加记得联调
  return (
    <div className={styles.statisticFlowWrap}>
      <div className={styles.statisticsFlowCard}>
        <div className={styles.left}>
          <div className={styles.flowValue}>{beautifyThePrice(2000, ',', 0)}</div>
          <div className={styles.flowText}>日均客流</div>
        </div>
        <div className={styles.right}>
          <IconFont iconHref='iconic_rijunkeliu' className={styles.rightIcon} />
        </div>
      </div>
      <div className={cs(styles.statisticsFlowCard, 'ml-16 mr-16')}>
        <div className={styles.left}>
          <div className={styles.flowValue}>{beautifyThePrice(2000, ',', 0)}</div>
          <div className={styles.flowText}>工作日日均客流</div>
        </div>
        <div className={styles.right}>
          <IconFont iconHref='iconic_pingjunkeliugongzuori' className={styles.rightIcon} />
        </div>
      </div>
      <div className={styles.statisticsFlowCard}>
        <div className={styles.left}>
          <div className={styles.flowValue}>{beautifyThePrice(2000, ',', 0)}</div>
          <div className={styles.flowText}>节假日日均客流</div>
        </div>
        <div className={styles.right}>
          <IconFont iconHref='iconic_jiejiarikeliu' className={styles.rightIcon} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsFlowCard;
