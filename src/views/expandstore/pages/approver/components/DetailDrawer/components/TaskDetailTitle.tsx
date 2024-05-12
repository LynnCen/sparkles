/**
 * @Description 拓店任务title
 */

import { FC, useEffect, useMemo, useRef } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import styles from '../index.module.less';
import cs from 'classnames';
import { Button } from 'antd';
import { TaskChange, TaskStatusColor } from '../../../ts-config';

const TaskDetailTitle:FC<any> = ({
  detail,
  titleHeightRef,
}) => {
  const selfRef: any = useRef();
  /**
   * @description 是否展示开发异动审批中按钮，异动审批中时展示
   */
  const showApprovingButton = useMemo(() => {
    return detail && detail.taskChangeApprovalStatus === TaskChange.Approving;
  }, [detail]);

  useEffect(() => {
    if (!Object.keys(detail)?.length) return;
    setTimeout(() => {
      titleHeightRef.current = selfRef.current?.getBoundingClientRect()?.height || 0;
    }, 0);
  }, [detail]);

  return <div ref={selfRef} className={styles.taskDetailTitleCon}>
    <V2Title
      text={detail?.name}
      extra={
        <div className={cs(styles.extraButtons, styles.flexRow)}>

          { showApprovingButton ? <div className={styles.approvingBtn}>
            <Button type='text' className='ml-16'>开发异动中</Button>
          </div> : <></>}
        </div>
      }/>
    <div
      className={styles.statusBox}
      style={{
        ...TaskStatusColor[detail?.status]
      }}
    >{detail?.statusName}</div>
  </div>;
};
export default TaskDetailTitle;
