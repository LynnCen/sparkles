import { FC, ReactNode } from 'react';
import styles from './style/description.module.less';

interface DescriptionProps {
  label?: ReactNode;
  children?: ReactNode
}

const Description: FC<DescriptionProps> = ({ label, children }) => {
  const prefixCls = 'description';
  const wrapper = `${prefixCls}-wrapper`;
  const labelCls = `${prefixCls}-label`;
  const contentCls = `${prefixCls}-content`;
  return (
    <div className={styles[wrapper]}>
      <div className={styles[prefixCls]}>
        <span className={styles[labelCls]}>
          {label}：
        </span>
        <div className={styles[contentCls]}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Description;
