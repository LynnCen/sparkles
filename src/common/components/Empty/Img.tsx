/**
 * @Description 暂无图片
 */

import { FC } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import IconFont from '@/common/components/IconFont';

const Img: FC<any> = ({
  className,
  style,
  children,
}) => {

  return (
    <div
      className={cs(styles.wrapperCon, className)}
      style={style}
    >
      {
        children || <div className={styles.content}>
          <IconFont
            iconHref='icontupian-one'
            className='fs-32 c-ddd'
          />
          <div className='c-999 fs-12'>
            图片拍摄中
          </div>
        </div>
      }
    </div>
  );
};

export default Img;
