import { FC, useEffect, useMemo, useState } from 'react';
import { StoreDetail } from '../ts-config';
import { storeRecords } from '@/common/api/passenger-flow';
import { useMethods } from '@lhb/hook';
import styles from '../entry.module.less';
import cs from 'classnames';
import NoSetting from './NoSetting';
import dayjs from 'dayjs';

interface RecordsProps {
  detail: StoreDetail | Record<string, any>;
  open?: boolean;
}

// 处理后用于展示的记录
interface ShowRecord {
  // 接口返回字段
  id: number;
  createdAt: string;
  dayOfWeek: number;
  dayOfWeekName: string;
  employeeId: number;
  employeeName: string;
  employeePosition: string;
  operation: string;
  // 加工后字段
  MMDD: string; // MM-DD
  HHmmss: string; // hh-mm-ss
  prevRecordSameDate: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const FLAG_BOLD = '<b>';

const Records: FC<RecordsProps> = ({ detail, open }) => {

  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => {
    if (detail.id && open) {
      methods.getRecords();
    }
    // 用户做操作后，detail发生变动，刷新记录
  }, [detail, open]);

  const methods = useMethods({
    getRecords: async () => {
      const data = await storeRecords({ storeId: detail.id });
      setRecords(data || []);
    }
  });

  const formatRocords: ShowRecord[] = useMemo(() => {
    if (!records) return [];

    let isFirst = true;
    let prevYMD = '';

    const all = records.map((row: any, index: number) => {
      const YMD = dayjs(row.createdAt).format('YYYY-MM-DD'); // 日期
      const MMDD = dayjs(row.createdAt).format('MM-DD'); // 显示用日期
      const HHmmss = dayjs(row.createdAt).format('HH:mm:ss'); // 显示用时间

      const obj: ShowRecord = {
        ...row,
        MMDD,
        HHmmss,
        prevRecordSameDate: YMD === prevYMD,
        isFirst,
        isLast: index === records.length - 1,
      };
      isFirst = false;
      prevYMD = YMD;

      return obj;
    });
    return all;
  }, [records]);

  return (
    <div className={styles.recordsWrapper}>
      {
        (Array.isArray(formatRocords) && formatRocords.length)
          ? formatRocords.map((row: any, index: number) => (
            <div className={styles.record} key={index}>
              <div className={cs('fs-14 bold', styles.recordLeft)}>
                {
                  !row.prevRecordSameDate && (
                    <>
                      <span>{row.MMDD}</span>
                      <span className='ml-8'>{row.dayOfWeekName}</span>
                    </>
                  )
                }
              </div>

              <div className={styles.recordCenter}>
                { row.isFirst && <div className={styles.topInset}></div> }
                { !row.isFirst && row.isLast && <div className={styles.topLine}></div> }
                <div className={styles.outterDot}>
                  <div className={styles.innerDot}></div>
                </div>
                { !row.isLast && <div className={styles.bottomLine}></div> }
              </div>

              <div className={styles.recordRight}>
                <span className={'bold'}>{row.HHmmss}</span>
                <span className={'bold ml-10'}>{row.employeeName}{row.employeePosition ? `(${row.employeePosition})` : ''}</span>
                {
                  !row.operation.split(';').length
                    ? <span className='ml-12'>{row.operation}</span>
                    : row.operation.split(';').map((itm: any, index: number) => (
                      <span className={cs(!index ? 'ml-12' : itm.startsWith(FLAG_BOLD) ? 'ml-5 mr-5' : '', itm.startsWith(FLAG_BOLD) ? 'bold' : '')} key={index}>
                        {itm.replace(FLAG_BOLD, '')}
                      </span>
                    ))
                }
              </div>
            </div>
          )) : <NoSetting/>
      }
    </div>
  );
};

export default Records;
