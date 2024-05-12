import React, { FC, useState, useContext } from 'react';
import WFC from './OperatorContext';
import styles from '../index.module.less';
import cs from 'classnames';

const ZOOM = {
  DOWN: 1,
  UP: 2,
  MIN: 50,
  MAX: 300
};

const Zoom: FC<any> = (props) => {
  const { detail }: any = useContext(WFC);

  // 放大比例, 按百分制给 100 为 100%
  const [scale, setScale] = useState<number>(100);
  function zoomSize(type: any) {
    if (type === ZOOM.DOWN) {
      if (scale === ZOOM.MIN) {
        return;
      }
      setScale(scale - 10);
    }
    if (type === ZOOM.UP) {
      if (scale === ZOOM.MAX) {
        return;
      }
      setScale(scale + 10);
    }
  }
  return (
    <React.Fragment>
      {!detail && <div className={styles.zoom}>
        <div className={cs(styles.zoomOut, scale === ZOOM.MIN ? styles.disabled : '')} onClick={() => zoomSize(ZOOM.DOWN)}></div>
        <span>{scale}%</span>
        <div className={cs(styles.zoomIn, scale === ZOOM.MAX ? styles.disabled : '')} onClick={() => zoomSize(ZOOM.UP)}></div>
      </div>}
      <div className={styles.boxScale} id='boxScale' style={{ 'transform': `scale(${scale / 100})`, 'transformOrigin': '50% 0px 0px' }}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default Zoom;
