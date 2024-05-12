import React, { FC, ReactNode, useRef } from 'react';
import styles from './index.module.less';

interface SearchTableContainerProps {
  topComponent?: ReactNode;
  children?: ReactNode;
  offsetTop?: number;
}

const maxHeight = 'calc(100vh - 160px)';

const SearchTableContainer: FC<SearchTableContainerProps> = ({ topComponent, children, offsetTop = 0 }) => {
  const topComponentRef = useRef<HTMLDivElement>();
  const { offsetHeight = 0 } = (topComponentRef.current || {}) as any;
  return (
    <>
      <div className={styles.wrapper}>
        <div ref={topComponentRef as any}>
          {topComponent}
        </div>
        <div className={styles.children}>
          { children && React.cloneElement(children as any,
            { wrapStyle: {
              maxHeight: `calc(${maxHeight} - ${offsetHeight}px - ${offsetTop}px)`
            } })}
        </div>
      </div>
    </>
  );
};


export default SearchTableContainer;
