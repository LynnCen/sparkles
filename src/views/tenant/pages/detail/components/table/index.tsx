
import { Card, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { FC, ReactNode } from 'react';
import styles from './index.module.less';


interface ActionTableProps {
  data?: any[];
  columns?: ColumnType<any>;
  actions?: ReactNode;
  title?: ReactNode;
  loading?: boolean;
  dataSource?: any[];
};


const ActionTable: FC<ActionTableProps> = (props) => {
  const { title, actions, ...resetProps } = props;



  return (
    <>
      <Card>
        <div className={styles.tableToolbar}>
          <div className={styles.tableToolbarContainer}>
            <div className={styles.tableToolbarLeft}>
              <div className={styles.tableToolbarTitle}>{title}</div>
            </div>
            <div className={styles.tableToolbarRight}>
              {actions}
            </div>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <Table
            {...resetProps as any}
            rowKey='id'
            sticky
            pagination={false}/>
        </div>
      </Card>
    </>
  );
};

export default ActionTable;
