import { FC } from 'react';
// import { operateRecords } from '@/common/api/purchase';
// import { useMethods } from '@lhb/hook';
import styles from '../entry.module.less';
// import cs from 'classnames';

// 处理后用于展示的记录
// interface ShowRecord {
//   // 接口返回字段
//   id: number;
//   createdAt: string;
//   dayOfWeek: number;
//   dayOfWeekName: string;
//   employeeId: number;
//   employeeName: string;
//   employeePosition: string;
//   operation: string;
//   // 加工后字段
//   date: string; // MM-DD
//   time: string; // hh-mm-ss
//   prevRecordSameDate: boolean;
//   prevRecordSameOperate: boolean;
//   nextRecordSameOperate: boolean;
//   isFirst: boolean;
//   isLast: boolean;
// }

const Records: FC<any> = ({ detail }) => {
  console.log('Records', detail);

  return (
    <div className={styles.recordsWrapper}>
    </div>
  );
};

export default Records;
