import React, { FC } from 'react';
import { Row } from 'antd';

interface RowItemProps {
  className?: string;
  rowConfig?: any;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  hasRB?: boolean;
}

const RowItem: FC<RowItemProps> = ({
  children,
  className,
  rowConfig
}) => {

  return (
    <Row className={className} {...rowConfig}>
      {children}
    </Row>
  );
};

export default RowItem;
