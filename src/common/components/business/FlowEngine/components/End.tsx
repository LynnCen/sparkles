import { FC } from 'react';
import styles from '../index.module.less';

const EndNode: FC<any> = () => {
  return (<div className={styles.endNode}>
    <div className={styles.endNodeText}>END</div>
  </div>);
};

export default EndNode;
