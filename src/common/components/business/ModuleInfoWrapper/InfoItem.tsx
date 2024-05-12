import React, { FC } from 'react';
import { isNotEmpty } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
import { Col } from 'antd';

interface InfoItemProps {
  className?: string;
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
          <div className={cs(styles['info-item-val-row'], labelValClassName)}>
            {isNotEmpty(labelVal) ? labelVal : '-'}
          </div>
          <div className={cs(styles['info-item-label-row'], labelClassName)}>
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
