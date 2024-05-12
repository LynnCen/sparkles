import { CSSProperties, FC, ReactNode } from 'react';
import cs from 'classnames';
import styles from '../entry.module.less';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
const DrawerSide: FC<{
  className?: string;
  style?: CSSProperties;
  placement: 'left' | 'right';
  visible: boolean;
  onClose: () => void;
  onShow: () => void;
  children: ReactNode;
  btnTop?: number|string;
}> = ({
  className,
  style,
  placement,
  visible,
  onClose,
  onShow,
  children,
  btnTop = '50px'
}) => {
  return <div
    style={{
      ...style
    }}
    className={cs(styles.drawerSide,
      visible && (placement === 'right' ? styles.rightShow : styles.leftShow),
      `${placement}Drawer`,
      className)}>
    <div
      style={{
        top: btnTop
      }}
      className={cs(styles.sideBtn, placement === 'right' ? styles.rightBtn : styles.leftBtn)}
      onClick={() => visible ? onClose() : onShow() }>
      <div className={styles.btnBack}></div>
      {((visible && placement === 'right') || (!visible && placement === 'left'))
        ? <CaretRightOutlined style={{ color: '#656E85' }} />
        : <CaretLeftOutlined style={{ color: '#656E85' }} />}
    </div>
    {children}
  </div>;
};

export default DrawerSide;
