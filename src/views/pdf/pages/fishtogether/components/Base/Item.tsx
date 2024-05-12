import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

const Item: FC<any> = ({
  className,
  children,
  style = {},
  label
}) => {
  return (
    <div className={cs(styles.item, className)} style={style}>
      <div className={styles.itemLabel}>{label}</div>
      <div className={styles.itemValue}>{children}</div>
    </div>
  );
};

export default Item;
