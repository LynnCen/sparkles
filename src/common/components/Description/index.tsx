import { CSSProperties, FC, ReactNode } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

interface DescriptionProps {
  label?: ReactNode;
  children?: ReactNode;
  direction?: 'vertical' | 'horizontal';
  colon?: boolean
  wrapperStyle?: CSSProperties;
  border?: boolean;
  fixedLabel?: boolean;
}

const Description: FC<DescriptionProps> = ({ label, fixedLabel, children, direction = 'horizontal', border = false, colon = true, wrapperStyle }) => {
  const prefixCls = 'description';
  const vertical = `${prefixCls}-${direction}`;
  const wrapper = `${prefixCls}-wrapper`;
  const labelCls = cs(styles[`${prefixCls}-label`], (border || fixedLabel) && styles['border-label']);
  const contentCls = cs(styles[`${prefixCls}-content`], border && styles['border-content']);
  return (
    <div className={styles[wrapper]} style={wrapperStyle}>
      <div className={cs(styles[prefixCls], styles[vertical])}>
        {label && (
          <span className={labelCls}>
            {label}
            {(direction === 'horizontal' && colon === true) && '：'}
          </span>
        )}
        <div className={contentCls}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Description;
