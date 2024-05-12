import { CSSProperties, FC, ReactNode } from 'react';
import styles from './index.module.less';

interface LayoutProps {
  actions?: ReactNode;
  children?: ReactNode;
  anchors?: ReactNode;
  id?: string;
  bodyStyle?: CSSProperties;
  actionStyle?: CSSProperties
}

const Layout: FC<LayoutProps> = ({ actions, children, anchors, id, bodyStyle, actionStyle }) => {
  const prefixCls = 'layout-customer';
  const layoutWrapper = `${prefixCls}-wrapper`;
  const action = `${prefixCls}-action`;
  const actionWrapper = `${action}-wrapper`;
  const body = `${prefixCls}-body`;
  const bodyWrapper = `${body}-wrapper`;
  const anchor = `${prefixCls}-anchor`;

  return (
    <div className={styles[layoutWrapper]} id={id}>
      <div className={styles[prefixCls]}>
        <div className={styles[bodyWrapper]}>
          <div style={{ ...bodyStyle, }} className={styles[body]}>{children}</div>
          {anchors && <div className={styles[anchor]}>{anchors}</div>}
        </div>
        {actions && (
          <div className={styles[actionWrapper]} style={actionStyle}>
            <div className={styles[action]}>{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
