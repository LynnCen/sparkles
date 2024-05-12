import React from 'react';
import cs from 'classnames';
import styles from './index.module.less';

interface IProps {
  text?: string | React.ReactNode;
  imgClassName?: string;
  textClassName?: string;
}
const Greeting: React.FC<IProps> = ({ text = '页面走丢了', imgClassName, textClassName }) => {
  return (
    <div className={styles.voidImgWrapper}>
      <img
        className={cs(styles.voidImg, imgClassName)}
        src='https://staticres.linhuiba.com/project-custom/location2.0/store-developer/ic_kongzhuangtai@2x.png'
      />
      <div className={cs(styles.voidText, 'mt-12', textClassName)}>{text}</div>
    </div>
  );
};

export default Greeting;
