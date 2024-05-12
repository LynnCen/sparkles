/* 踩点卡片 */
import React from 'react';
import { Col } from 'antd';
import IconFont from '@/common/components/IconFont';
import { FootPrintCardProps } from './ts-config';
import styles from './index.module.less';
import { valueFormat } from '@/common/utils/ways';

const FootPrintCard: React.FC<FootPrintCardProps> = ({
  count,
  title,
  icon,
}) => {
  return (
    <Col span={6}>
      <div className={styles.card}>
        <div className={styles.topStyle}>
          <div className={styles.left}>
            <p className={styles.title}>{title}</p>
            <div className={styles.content}>
              <div className={styles.number}>{valueFormat(count)}</div>
            </div>
          </div>
          {icon ? (
            <div className={styles.right}>
              <IconFont iconHref={icon} />
            </div>
          ) : null}
        </div>
      </div>
    </Col>
  );
};

export default FootPrintCard;
