import { FC, ReactNode } from 'react';
import './style/layout.less';

interface LayoutProps {
  actions?: ReactNode;
  children?: ReactNode;
  anchors?: ReactNode;
}

const Layout: FC<LayoutProps> = ({ actions, children, anchors }) => {
  const prefixCls = 'layout';
  const layoutWrapper = `${prefixCls}-wrapper`;
  const action = `${prefixCls}-action`;
  const actionWrapper = `${action}-wrapper`;
  const body = `${prefixCls}-body`;
  const bodyWrapper = `${body}-wrapper`;
  const anchor = `${prefixCls}-anchor`;

  return (
    <div className={layoutWrapper}>
      <div className={prefixCls}>
        <div className={bodyWrapper}>
          <div className={body}>{children}</div>
          {anchors && <div className={anchor}>{anchors}</div>}
        </div>
        {actions && (
          <div className={actionWrapper}>
            <div className={action}>{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
