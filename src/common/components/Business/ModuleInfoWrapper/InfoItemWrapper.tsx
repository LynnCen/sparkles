import React, { FC, useMemo } from 'react';
import cs from 'classnames';
import { Row } from 'antd';
import styles from './index.module.less';
import InfoItem from './InfoItem';
import { floorKeep } from '@lhb/func';

interface InfoItemWrapperProps {
  data:any[];
  className?: string;
  columns: number;
  maxSize?: number; // 最多显示个数,防止数据过多格式变形
  gap?: number ; // 行间距
  style?: React.CSSProperties;
  theme?: 'default' | 'dark'; // default: dark: 黑暗样式
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  hasRB?: boolean;
}
const InfoItemWrapper: FC<InfoItemWrapperProps> = ({
  data = [],
  className,
  columns = 3,
  maxSize = 6,
  gap = 20,
  style,
  theme = 'default',
  onClick,
  hasRB = true
}) => {
  const span = useMemo(() => {
    return +floorKeep(24, columns, 4, 0);
  }, [columns]);

  return (
    <Row
      gutter={[0, gap]}
      className={cs(className, styles['info-item-wrapper'])}
      style={style}>
      { data?.map((item, index) => {
        if (!item || index + 1 > maxSize) return;
        const noRB = (index + 1) % columns === 0; // 最后一列不需要右边框
        return <InfoItem
          key={index}
          label={item.name}
          labelVal={item.value}
          unit={item.unit}
          span={span}
          hasRB={hasRB && !noRB}
          onClick={() => onClick?.(item)}
          theme={theme}
        />;
      })}
    </Row>
  );
};

export default InfoItemWrapper;
