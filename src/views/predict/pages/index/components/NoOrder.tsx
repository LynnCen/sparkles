import { Link } from 'react-router-dom';
import NotFound from '@/common/components/NotFound';
import styles from './index.module.less';

const NoOrder = () => {
  return (
    <div className={styles.noOrder}>
      <NotFound
        text={
          <div className={styles.info}>
            门店订单数据是否还没导入？至少需要距今前30天店订单数据，方可准确预测哦～
            <Link to={`/order/manage`}>马上导入{'>>'}</Link>
          </div>
        }
      />
    </div>
  );
};

export default NoOrder;
