/**
 * @Description 卡旺卡拓店任务详情 - header
 */
import { FC, useMemo, useState } from 'react';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import IconFont from '@/common/components/IconFont';
import { Button } from 'antd';
import TaskHistory from './TaskHistory';
import TaskChangeModal from './TaskChangeModal';
import { TaskChange, TaskStatus } from '@/common/components/business/ExpandStore/ts-config';
import { isArray, isNotEmptyAny } from '@lhb/func';
import styles from '../index.module.less';
import cs from 'classnames';
import { TaskStatusColor } from '../ts-config';

const Header: FC<any> = ({
  detail,
  isApproval = false,
  isHistory = false,
  hideOperate = false,
  onRefresh
}) => {
  const [changeVisible, setChangeVisible] = useState<boolean>(false); // 异动申请弹框
  const [historyVisible, setHistoryVisible] = useState<boolean>(false); // 任务历史弹框

  /**
   * @description 是否展示开发异动按钮，有启用异动、未提交异动、且有异动权限时展示
   */
  const showChangeButton = useMemo(() => {
    return !hideOperate && isNotEmptyAny(detail) && detail.taskChangeApprovalStatus === TaskChange.None && isArray(detail.buttons) && !!detail.buttons.length && detail.taskChangeButton === 1;
  }, [detail]);

  /**
   * @description 是否展示开发异动审批中按钮，异动审批中时展示
   */
  const showApprovingButton = useMemo(() => {
    return !isApproval && detail && detail.taskChangeApprovalStatus === TaskChange.Approving;
  }, [detail]);

  /**
   * @description 是否展示任务历史按钮
   */
  const showHistoryButton = useMemo(() => {
    // 历史详情页、或已变更不展示任务历史
    return !isApproval && !isHistory && isNotEmptyAny(detail) && detail.status !== TaskStatus.Changed;
  }, [detail]);

  /**
   * @description 点击开发异动
   */
  const taskChangeHandle = () => {
    // 申请异动弹框
    setChangeVisible(true);
  };

  /**
   * @description 点击开发异动中
   */
  const taskApprovingHandle = () => {
    V2Message.warning(`异动申请中，在我发起的审批中查看`);
  };

  /**
   * @description 任务历史
   */
  const historyHandle = () => {
    // 历史弹框
    setHistoryVisible(true);
  };

  return (<>
    <div className={styles.taskDetailHeader}>
      <div className={styles.headerLeft}>
        <span className={cs('fs-18 bold', styles.name)}>{detail?.name}</span>
        <div
          className={cs('ml-10 fs-12', styles.statusBox)}
          style={{
            ...TaskStatusColor[detail?.status]
          }}
        >{detail?.statusName}</div>
      </div>

      <div className={styles.extraButtons}>
        { showHistoryButton ? <div className={cs(styles.historyBtn, 'ml-16')} onClick={historyHandle}>
          <IconFont iconHref='iconic_lishirenwu' className={cs(styles.icon, 'mr-5')} />
          <span className='fs-14 c-172'>历史任务</span>
        </div> : <></>}
        { showChangeButton ? <div className={cs(styles.changeBtn, 'ml-16')}>
          <Button onClick={taskChangeHandle}>开发异动</Button>
        </div> : <></>}
        { showApprovingButton ? <div className={cs(styles.approvingBtn, 'ml-16')}>
          <Button type='text' onClick={taskApprovingHandle}>开发异动中</Button>
        </div> : <></>}
      </div>
    </div>

    {/* 发起异动 */}
    <TaskChangeModal
      visible={changeVisible}
      setVisible={setChangeVisible}
      detail={detail}
      onRefresh={onRefresh}
    />

    {/* 任务历史 */}
    <TaskHistory
      open={historyVisible}
      setOpen={setHistoryVisible}
      id={detail.id}
    />
  </>);
};
export default Header;
