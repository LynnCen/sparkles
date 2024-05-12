/**
 * @Description 拓店任务详情，不含顶部操作按钮
 *   目前在拓店任务抽屉、拓店异动审批详情、机会点详情的关联任务信息栏使用
 */
import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Divider } from 'antd';
import BasicInfo from './components/BasicInfo';
import TaskList from './components/TaskList';
import StatusRecords from './components/StatusRecords';
import styles from './index.module.less';
import { isNotEmptyAny } from '@lhb/func';

const FranchiseeDetail: FC<any> = forwardRef(({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  style = {},
  detail,
  isUpdateMode,
  setIsUpdateMode,
  setSubmitting,
  refresh,
}, ref) => {
  // 外部调用保存加盟商
  useImperativeHandle(ref, () => ({
    confirmHandle: () => {
      (basicRef.current as any).confirmHandle();
    },
  }));
  const basicRef: any = useRef(null);
  const [recrodsRefreshFlag, setRecordsRefreshFlag] = useState<number>(0);

  /**
   * @description 基本信息完成编辑后的刷新回调
   */
  const handleBasicRefresh = () => {
    // 触发刷新状态变更记录
    setRecordsRefreshFlag((state) => ++state);
    // 回调刷新
    refresh();
  };

  return (
    isNotEmptyAny(detail) ? <div
      className={styles.franchiseeDetail}
      style={{
        height: mainHeight || 'auto',
        ...style
      }}>

      {/* 基本信息动态表单 */}
      <BasicInfo
        ref={basicRef}
        detail={detail}
        isUpdateMode={isUpdateMode}
        setIsUpdateMode={setIsUpdateMode}
        setSubmitting={setSubmitting}
        refresh={handleBasicRefresh}
      />
      <Divider/>

      {/* 任务列表 */}
      <TaskList franchiseeId={detail.id} refresh={refresh}/>
      <Divider/>

      {/* 状态变更 */}
      <StatusRecords franchiseeId={detail.id} refreshFlag={recrodsRefreshFlag}/>
    </div> : <></>
  );
});

export default FranchiseeDetail;
