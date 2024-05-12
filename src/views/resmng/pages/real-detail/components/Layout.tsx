import { CSSProperties, FC, ReactNode } from 'react';
import styles from './style/layout.module.less';

interface LayoutProps {
  actions?: ReactNode;
  children?: ReactNode;
  anchors?: ReactNode;
  bodyWrapperStyle?: CSSProperties;
}

const Layout: FC<LayoutProps> = ({ actions, children, anchors, bodyWrapperStyle }) => {
  const prefixCls = 'layout';
  const layoutWrapper = `${prefixCls}-wrapper`;
  const action = `${prefixCls}-action`;
  const actionWrapper = `${action}-wrapper`;
  const body = `${prefixCls}-body`;
  const bodyWrapper = `${body}-wrapper`;
  const anchor = `${prefixCls}-anchor`;

  return (
    <div className={styles[layoutWrapper]}>
      <div className={styles[prefixCls]}>
        <div className={styles[bodyWrapper]} style={bodyWrapperStyle}>
          <div className={styles[body]}>{children}</div>
          {anchor && <div className={styles[anchor]}>{anchors}</div>}
        </div>
        <div className={styles[actionWrapper]}>
          <div className={styles[action]}>{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
