/**
 * @Description 加盟商详情内，状态变更记录
 */

import V2Title from '@/common/components/Feedback/V2Title';
import V2Empty from '@/common/components/Data/V2Empty';
import V2LogRecord from '@/common/components/SpecialBusiness/V2LogRecord';
import V2Tag from '@/common/components/Data/V2Tag';
import { isArray } from '@lhb/func';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import { franchiseeStatusRecord } from '@/common/api/expandStore/franchisee';

const StatusRecords: FC<any> = ({
  franchiseeId,
  refreshFlag,
}) => {

  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!franchiseeId) return;

    franchiseeStatusRecord({ id: franchiseeId }).then((data: any) => {
      isArray(data) && setRecords(data);
    });
  }, [franchiseeId, refreshFlag]);

  const items = useMemo(() => {
    return isArray(records) ? records.map(itm => ({
      date: '', // 时间线的左侧不展示内容
      status: 'finish', // 让时间线呈现蓝色
      children: [{
        name: '',
        time: itm.operateAt,
        description: `${itm.userName}${itm.oldStatusName ? '将加盟商状态变更为' : '创建了加盟商信息，状态为'}`,
        titleExtra: itm.newStatusName ? <V2Tag style={{ backgroundColor: 'rgba(0, 29, 140, 0.08)', color: '#001D8C' }}>{itm.newStatusName}</V2Tag> : <></>
      }]
    })) : [];
  }, [records]);

  return (
    <div className={styles.statusRecords}>
      <V2Title type='H2' text='状态变更' divider className='mb-16'/>
      {
        isArray(items) && items.length ? <V2LogRecord items={items} type={2} /> : <V2Empty/>
      }
    </div>
  );
};

export default StatusRecords;
