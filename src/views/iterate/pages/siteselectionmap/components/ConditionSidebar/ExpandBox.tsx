/**
 * @Description 展开收起盒子
 */
import { FC } from 'react';
import IconFont from '@/common/components/IconFont';
import React from 'react';
import styles from './index.module.less';
interface IProps {
  maxNumber: number;
  showAll:boolean;
  setShowAll:Function;
}
const ExpandBox: FC<IProps> = ({
  maxNumber,
  showAll,
  setShowAll,
  children,
}) => {
  // const [showAll, setShowAll] = useState<boolean>(false); // 是否展示全部
  return (
    <div>
      {React.Children.map(children, (child:any, index) => {
        if (!child) return;
        // 当index大于等于maxNumber且不展示全部的情况下，返回<></>
        if (index >= maxNumber && !showAll) {
          return React.cloneElement(child as any, {
            style: { display: 'none' },
          });
        };
        return child;
      })}
      {React.Children.count(children) > maxNumber ? (
        showAll ? (
          <div
            onClick={() => {
              setShowAll(false);
            }}
            className={styles.bottom}
          >
            <span className={styles.text}>收起</span>
            <IconFont iconHref='iconarrow-down-copy' className={styles.icon}/>
          </div>
        ) : (
          <div
            onClick={() => {
              setShowAll(true);
            }}
            className={styles.bottom}
          >
            <span className={styles.text}>展开</span>
            <IconFont iconHref='iconarrow-down' className={styles.icon}/>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
export default ExpandBox;
