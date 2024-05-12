import React, { FC } from 'react';
import { isNotEmpty } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
import { Col } from 'antd';

interface InfoItemProps {
  className?: string;
  theme?: 'default' | 'dark'; // default: dark: 黑暗样式
  label?: string;
  labelVal?: string;
  span?: number;
  unit?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  labelClassName?: string;
  labelValClassName?: string;
  hasRB?: boolean;
}
const InfoItem: FC<InfoItemProps> = ({
  className,
  theme = 'default',
  label,
  labelVal,
  span,
  unit,
  children,
  onClick,
  labelClassName,
  labelValClassName,
  hasRB = true
}) => {
  return (
    <Col onClick={onClick} span={span} className={cs(className, hasRB && styles['has-right-border'])}>
      <div className={styles.infoItem}>
        {children ||
        <>
          <div className={cs(styles['info-item-val-row'], styles[`info-item-val-row-${theme}`], labelValClassName)}>
            {isNotEmpty(labelVal) ? labelVal : '-'}
          </div>
          <div className={cs(styles['info-item-label-row'], styles[`info-item-label-row-${theme}`], labelClassName)}>
            {label}
            {unit && <span className={styles['info-item-val-unit']}>({unit})</span>}
          </div>
        </>
        }
      </div>
    </Col>
  );
};

export default InfoItem;
