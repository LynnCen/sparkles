import { FC } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

interface BrandTagProps {
  isLevel?: boolean; // 是否是等级，默认否，是标签
  levelName: string;
  className?: any;
  tagStyle?: Object;
}

const BrandTag: FC<BrandTagProps> = ({
  isLevel = false,
  levelName,
  className,
  tagStyle = {},
}) => {
  const levels = new Map([
    ['高档', 'level1'],
    ['中档', 'level2'],
    ['低档', 'level3']
  ]);
  const level = isLevel ? levels.get(levelName) : '';

  return (
    <span className={cs(styles.brandTag, level && styles[level], className)} style={tagStyle}>{levelName}</span>
  );
};

export default BrandTag;
