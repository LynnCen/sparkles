/**
 * @Description 拓店任务详情-沟通记录 目前看来卡旺卡和普通拓店任务处理无差异
 */

import { FC, useEffect, useState } from 'react';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { isArray } from '@lhb/func';
import styles from '../index.module.less';
import CreateCommunicationRecord from './CreateCommRecord';
import MeetCard from './MeetCard';
import { taskRecords } from '@/common/api/expandStore/expansiontask';
import V2Empty from '@/common/components/Data/V2Empty';
import { Button } from 'antd';

const Meet: FC<any> = ({
  id, // 任务id
  isView, // 是否只能查看（审批详情时只能查看）
}) => {

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [meetList, setMeetList] = useState<any>([]);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** 点击新增 */
  const onClickAdd = () => {
    // 限制20条记录
    if (meetList.length >= 20) {
      V2Confirm({
        onSure: (modal: any) => modal.destroy(),
        content: '沟通记录已达20次上限~',
        noFooter: true
      });
      return;
    }

    setShowCreateModal(true);
  };
  const getTaskRecords = async() => {
    const data = await taskRecords({ id });
    setMeetList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getTaskRecords();
  }, [id, refreshFlag]);

  return (
    <>
      {isLoading ? <></> : <div className={styles.communication}>
        {!isView && meetList.length ? <span
          className={styles.addcommunication}
          onClick={onClickAdd}
        >+ 新增沟通纪要</span> : <></>}
        { (isArray(meetList) && meetList.length > 0) ? meetList.map((item, index) => (
          <MeetCard detail={item} key={index}/>
        )) : <V2Empty
          className='mt-100'
          customTip={!isView ? <Button
            onClick={() => setShowCreateModal(true)}
            type='primary'>新增沟通纪要</Button> : '暂无记录'}
        />}
      </div>}
      <CreateCommunicationRecord
        id={id}
        refresh={() => setRefreshFlag((state) => state + 1)}
        open={showCreateModal}
        setOpen={setShowCreateModal}
        num={isArray(meetList) ? meetList.length : 0}
      />
    </>

  );
};
export default Meet;
