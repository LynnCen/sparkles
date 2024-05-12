import { FC, ReactNode } from 'react';
import './style/description.less';

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
    <div className={wrapper}>
      <div className={prefixCls}>
        <span className={labelCls}>
          {label}：
        </span>
        <div className={contentCls}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Description;
