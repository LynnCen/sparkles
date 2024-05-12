import { CSSProperties, FC, ReactNode } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

interface PageContainerProps {
  title?: ReactNode;
  children?: ReactNode;
  id?: string;
  nowrap?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  noBodyWrap?: boolean;
  wrapStyle?: CSSProperties;
  className?: string;
}

const PageContainer: FC<PageContainerProps> = ({
  title,
  children,
  id,
  nowrap = false,
  noBodyWrap = false,
  wrapStyle,
  className,
  noMargin = false,
  noPadding = false
}) => {
  const prefixCls = 'page-container';
  const containerWraper = `${prefixCls}-wrapper`;

  const header = `${prefixCls}-header`;
  const hederWrapper = `${header}-wrapper`;

  const headerTitle = `${prefixCls}-title`;

  const body = `${prefixCls}-body`;
  // const bodyWrapper = `${body}-wrapper`;


  return (
    <div className={cs(
      styles[containerWraper],
      nowrap && styles['no-padding-margin'],
      noPadding && styles['no-padding'],
      noMargin && styles['no-margin'],
      className
    )}
    style={wrapStyle}>
      <div className={styles[prefixCls]}>
        {title && (
          <div className={styles[hederWrapper]} id={id}>
            <div className={styles[header]}>
              <div className={cs(title && styles[headerTitle])}>{title}</div>
            </div>
          </div>
        )}
        <div className={cs(styles[body], noBodyWrap && styles['no-padding-margin'])}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
