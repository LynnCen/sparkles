/**
 * @Description 周边搜索-主题内容
 */
import { FC } from 'react';
import styles from '../entry.module.less';

export interface DetailProps {
  amapIns?: any;
  setAmapIns?: Function;
  mainHeight: any,
}

const MainCon: FC<any> = ({
  mainHeight,
  children
}) => {

  return (
    <div className={styles.mainCon}
      style={{
        height: `${mainHeight}px` || 'auto'
      }}>
      {children}
    </div>
  );
};

export default MainCon;
