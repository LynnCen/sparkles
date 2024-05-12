/**
 * @Description
 */
import { FC, ReactNode } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

interface PageTitleProps {
  content?: ReactNode | string; // 左侧显示标题
  tabs?: ReactNode; // 左侧显示tabs
  extra?: ReactNode;
}

const PageTitle: FC<PageTitleProps> = ({
  content,
  tabs,
  extra
}) => {
  return <>
    <div className={cs(styles.titleOperate, !tabs && styles.content)}>
      {tabs || content}
      {extra}
    </div>
    <span className={styles.line} />
  </>;
};
export default PageTitle;
