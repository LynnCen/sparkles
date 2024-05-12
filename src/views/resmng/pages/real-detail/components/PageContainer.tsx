import { FC, ReactNode } from 'react';
import styles from './style/page-container.module.less';

interface PageContainerProps {
  title?: ReactNode;
  children?: ReactNode;
  id?: string
}

const PageContainer: FC<PageContainerProps> = ({ title, children, id }) => {
  const prefixCls = 'page-container';
  const containerWraper = `${prefixCls}-wrapper`;

  const header = `${prefixCls}-header`;
  const hederWrapper = `${header}-wrapper`;

  const headerTitle = `${prefixCls}-title`;

  const body = `${prefixCls}-body`;
  const bodyWrapper = `${body}-wrapper`;


  return (
    <div className={styles[containerWraper]}>
      <div className={styles[prefixCls]}>
        <div className={styles[hederWrapper]} id={id}>
          <div className={styles[header]}>
            <div className={styles[headerTitle]}>{title}</div>
          </div>
        </div>
        <div className={styles[bodyWrapper]}>
          <div className={styles[body]}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
