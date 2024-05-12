// 提示

import { FC } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import cs from 'classnames';

import styles from './index.module.less';

interface IProps {
  name?: string;
  tips?: string;
  showTips?: boolean;
  className?: string;
  children?: any;
}

const TitleTips: FC<IProps> = ({
  name = '数据分析',
  tips = '如数值显示异常，请前往「订单管理」检查是否导入对应日期订单明细。',
  showTips = true,
  children,
  className,
}) => {
  return (
    <div className={cs(styles.tipsInfo, className && className)}>
      <span>
        {name}
        {showTips && (
          <Tooltip title={tips}>
            <InfoCircleOutlined className={styles.icon} />
          </Tooltip>
        )}
      </span>
      {children}
    </div>
  );
};

export default TitleTips;
