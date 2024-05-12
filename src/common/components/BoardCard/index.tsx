import { FC, ReactNode } from 'react';
import cs from 'classnames';

import styles from './index.module.less';

interface BoardCardProps {
  title?: string | ReactNode;
  rightSlot?: string | ReactNode;
  children?: string | ReactNode;
  childrenClassName?: any;
  boardCardClassName?: any;
}

const BoardCard: FC<BoardCardProps> = ({
  title,
  rightSlot, // 卡片右上角插槽
  children,
  childrenClassName,
  boardCardClassName,
}) => {

  return (
    <div className={cs(styles.boardCardContainer, boardCardClassName)} >
      {title && <div className={styles.cardTitle}>
        <div className={styles.title}>
          {title}
        </div>
        <div>
          {rightSlot}
        </div>
      </div>}
      <div className={cs(title ? styles.childrenBox : styles.noTitleBox, childrenClassName)}>
        {children}
      </div>
    </div >
  );
};

export default BoardCard;
