import React from 'react';
import cs from 'classnames';
import styles from './index.module.less';

interface IProps {
  text?: string;
}
const Greeting: React.FC<IProps> = ({ text = '页面走丢了' }) => {
  return (
    <div className={styles.voidImgWrapper}>
      <img
        className={styles.voidImg}
        src='https://staticres.linhuiba.com/project-custom/custom-flow/img_404@2x.png'
      />
      <div className={cs(styles.voidText, 'mt-12')}>{text}</div>
    </div>
  );
};

export default Greeting;
