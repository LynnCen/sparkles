import { Pagination } from 'antd';
import { CusPaginationProps } from './ts-config';
import { FC } from 'react';
import styles from './index.module.less';

const CustomerPagination: FC<CusPaginationProps> = ({
  total,
  current,
  onChange,
  onShowSizeChange,
  pageSize,
  disabled,
  paginationSlot,
  ...props
}) => {
  return (
    <div className={styles.pagination}>
      <div>{paginationSlot}</div>
      <Pagination
        current={current || 1}
        total={total}
        pageSize={pageSize}
        showSizeChanger
        disabled={disabled}
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
        onChange={onChange}
        onShowSizeChange={onShowSizeChange}
        {...props}
      />
    </div>
  );
};

export default CustomerPagination;
