/**
 * @Description 拓店任务详情，不含顶部操作按钮
 *   目前在拓店任务抽屉、拓店异动审批详情、机会点详情的关联任务信息栏使用
 */
import { FC, useRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import V2Tabs from '@/common/components/Data/V2Tabs';
import TaskDetailApproveInfo from '@/common/components/business/ExpandStore/TaskDetailApproveInfo';
import CircleBasicInfo from '@/common/components/business/ExpandStore/CircleBasicInfo';
import Meet from './components/Meet';
import PointMatching from './components/PointMatching';
import styles from './index.module.less';
import { TaskStatus } from '@/common/components/business/ExpandStore/ts-config';
import { isNotEmptyAny } from '@lhb/func';

enum TabKeys {
  changePoint = 'changePoint', // 机会点
  communication = 'communication', // 沟通记录
}
const CircleTaskDetail: FC<any> = forwardRef(({
  style = {},
  detail, // 拓店任务详情信息
  isApproval = false, // 是否审批详情内
  aprDetail = {}, // 审批详情
  refresh, // 主动刷新页面
  hideOperate = false, // 是否需要主动隐藏操作按钮
}, ref) => {
  const [chancePointInfo, setChancePointInfo] = useState<any>({});
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
    ];
  }, [chancePointInfo]);

  return (
    isNotEmptyAny(detail) ? <div
      className={styles.taskDetail}
      style={{ ...style }}
    >
      {/* 异动审批信息 */}
      <TaskDetailApproveInfo
        ref={approveInfoRef}
        detail={detail}
        aprDetail={aprDetail}
      />

      {/* 基本信息 */}
      <CircleBasicInfo
        taskDetail={detail}
      />
      <V2Tabs items={tabItems} onChange={(value: any) => setActive(value)} className='mt-16'/>

      {/* 沟通记录 */}
      {active === TabKeys.communication ? <Meet
        id={detail.id}
        isView={isView}
      /> : <></>}

      {/* 匹配点位-机会点 */}
      {active === TabKeys.changePoint ? <PointMatching
        id={detail.id}
        modelClusterId={detail?.modelClusterInfo?.modelClusterId}
        refresh={refresh}
        chancePointInfo={chancePointInfo}
        setChancePointInfo={setChancePointInfo}
        isView={isView}/> : <></>}
    </div> : <></>
  );
});

export default CircleTaskDetail;
