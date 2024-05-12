/**
 * @Description
 */

import { FC } from 'react';
// import cs from 'classnames';
import styles from './index.module.less';

const CanvasCom: FC<any> = ({
  canvasRef,
  realSize,
}) => {

  return (
    <div
      className={styles.canvasMask}
      style={{
        width: realSize.width,
        height: realSize.height,
        // border: '1px solid pink'
      }}>
      <canvas
        ref={canvasRef}
        width={realSize.width}
        height={realSize.height}
      >
      </canvas>
    </div>
  );
};

export default CanvasCom;
