import { FC } from 'react';
import styles from './index.module.less';

interface IProps {
  text?: string;
  clickText?: string;
  onOpen?: Function;
}

const NoSetting: FC<IProps> = ({
  text = '暂无数据',
  clickText = '',
  onOpen,
}) => {
  return (
    <div className={styles.voidImgWrapper}>
      <img
        className={styles.voidImg}
        src='https://staticres.linhuiba.com/project-custom/custom-flow/img_404@2x.png'
      />
      <div className={styles.voidText}>
        {text}
        {clickText && <span className={styles.clickText} onClick={() => onOpen && onOpen()}>{clickText}</span>}
      </div>
    </div>
  );
};

export default NoSetting;
