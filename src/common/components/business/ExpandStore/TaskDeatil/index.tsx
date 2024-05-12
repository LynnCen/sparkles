/**
 * @Description 拓店任务详情，不含顶部操作按钮
 *   目前在拓店任务抽屉、拓店异动审批详情、机会点详情的关联任务信息栏使用
 */
import { FC, useRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { TaskStatus } from '@/common/components/business/ExpandStore/ts-config';
import TaskDetailApproveInfo from '@/common/components/business/ExpandStore/TaskDetailApproveInfo';
import TaskBasic from './components/TaskBasic/index';
import Meet from './components/Meet';
import PointMatching from './components/PointMatching';
import styles from './index.module.less';
import BasicInfo from './components/BasicInfo.tsx';
import V2Tabs from '@/common/components/Data/V2Tabs';
enum TabKeys {
  changePoint = 'changePoint', // 机会点
  communication = 'communication', // 沟通记录
  taskInfo = 'taskInfo', // 任务信息
}
const TaskDetail: FC<any> = forwardRef(({
  style = {},
  // mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  detail, // 拓店任务详情信息
  open, // 拓店任务详情抽屉是否打开
  isApproval = false, // 是否审批详情内
  aprDetail = {}, // 审批详情
  refresh, // 主动刷新页面
  hideOperate = false, // 是否需要主动隐藏操作按钮
}, ref) => {
  const [chancePointInfo, setChancePointInfo] = useState<any>(null);
  const [active, setActive] = useState<TabKeys>(TabKeys.changePoint);

  // 外部调用异动审批通过操作
  useImperativeHandle(ref, () => ({
    approveTaskChange: (cb: Function) => {
      (approveInfoRef?.current as any).approveTaskChange(cb);
    },
  }));
  const approveInfoRef = useRef(null);

  // 是否只能查看不能新增数据（审批详情或者拓店任务状态非进行中时）
  // 手动控制hideOperate
  const isView = isApproval || detail.status !== TaskStatus.Processing || hideOperate;

  const tabItems = useMemo(() => {
    return [
      {
        key: TabKeys.changePoint,
        label: `机会点 ${chancePointInfo?.objectList?.length || 0}`,
      },
      {
        key: TabKeys.communication,
        label: `沟通记录`,
      },
      {
        key: TabKeys.taskInfo,
        label: `任务信息`,
      },
    ];
  }, [chancePointInfo]);

  return (
    detail ? <div
      className={styles.taskDetail}
      style={{
        // height: mainHeight || 'auto',
        // overflowY: 'scroll',
        // overflowX: 'hidden',
        ...style
      }}
    >

      {/* 异动审批信息 */}
      <TaskDetailApproveInfo
        ref={approveInfoRef}
        detail={detail}
        aprDetail={aprDetail}/>

      <BasicInfo
        detail={detail}
        aprDetail={aprDetail}
      />

      <V2Tabs items={tabItems} onChange={(value:any) => setActive(value)}/>

      {/* 任务信息 */}
      {active === TabKeys.taskInfo ? <TaskBasic
        detail={detail}
        open={open}
        canEditType={!isApproval}
        refresh={refresh}/> : <></>}

      {/* 沟通记录 */}
      {active === TabKeys.communication ? <Meet
        id={detail.id}
        // open={open}
        // refresh={refresh}
        // meetList={detail.communicationRecords}
        isView={isView}/> : <></>}

      {/* 匹配点位-机会点 */}
      {active === TabKeys.changePoint ? <PointMatching
        id={detail.id}
        refresh={refresh}
        // chancePoints={detail.chancePoints}
        chancePointInfo={chancePointInfo}
        setChancePointInfo={setChancePointInfo}
        isView={isView}/> : <></>}
    </div> : <></>
  );
});

export default TaskDetail;
