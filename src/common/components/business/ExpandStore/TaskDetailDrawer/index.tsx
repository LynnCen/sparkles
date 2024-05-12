/**
 * @Description 拓店任务详情
 * 1109 标准版数据迁移引用该组件，显示拓店任务详情内容
 */
import { FC, useEffect, useMemo, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import IconFont from '@/common/components/IconFont';
import { getTaskInfo } from '@/common/api/expandStore/expansiontask';
import { Button, Spin } from 'antd';
import TaskDetail from '@/common/components/business/ExpandStore/TaskDeatil';
import TaskHistory from './components/TaskHistory';
import TaskChangeModal from './components/TaskChangeModal';
import { TaskChange, TaskStatus } from '@/common/components/business/ExpandStore/ts-config';
import { isArray } from '@lhb/func';
import styles from './index.module.less';
import cs from 'classnames';
import { TaskStatusColor } from './ts-config';
import { getApprovalDetail } from '@/common/api/expandStore/approveworkbench';
interface Props {
  /** 是否打开 */
  open: boolean;
  /** 控制是否打开 */
  setOpen: Function;
  /** 拓店任务Id*/
  id;
  /** 是否拓店任务历史详情 */
  isHistory?: boolean;
  /** 是否隐藏操作按钮 */
  hideOperate?: boolean;
  // 刷新外层调用方处理（通常是页面）
  outterRefresh?: Function;
}

const TaskDetailDrawer: FC<Props> = ({
  open,
  setOpen,
  id,
  isHistory = false,
  hideOperate = false,
  outterRefresh,
}) => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [detail, setDetail] = useState<any>({}); // 拓店任务详情信息
  const [loading, setLoading] = useState<boolean>(false); // 加载中
  const [refresh, setRefresh] = useState<boolean>(false); // 刷新
  const [changeVisible, setChangeVisible] = useState<boolean>(false); // 异动申请弹框
  const [historyVisible, setHistoryVisible] = useState<boolean>(false); // 任务历史弹框
  const [approvalDetail, setApprovalDetail] = useState<any>(null);// 审批详情

  useEffect(() => {
    if (!id && !refresh) return;

    open && getTaskDetail();
    // 非打开抽屉时初次请求，是操作后刷新时，同时回调刷新外层
    (refresh && outterRefresh) && outterRefresh();
  }, [id, refresh, open]);

  const getTaskDetail = async () => {
    setLoading(true);
    try {
      getTaskInfo({ id }).then(async (res) => {
        setDetail(res);
        setRefresh(false); // 刷新结束
      });

      setLoading(false);
    } catch (error) {
      setRefresh(false);
      setLoading(false);
    }
  };

  /**
   * @description 是否展示开发异动按钮，有启用异动、未提交异动、且有异动权限时展示
   */
  const showChangeButton = useMemo(() => {
    return detail && detail.taskChangeApprovalStatus === TaskChange.None && isArray(detail.buttons) && !!detail.buttons.length && detail.taskChangeButton === 1;
  }, [detail]);

  /**
   * @description 是否展示开发异动审批中按钮，异动审批中时展示
   */
  const showApprovingButton = useMemo(() => {
    return detail && detail.taskChangeApprovalStatus === TaskChange.Approving;
  }, [detail]);

  /**
   * @description 是否展示任务历史按钮
   */
  const showHistoryButton = useMemo(() => {
    // 历史详情页、或已变更不展示任务历史
    return !isHistory && detail && detail.status !== TaskStatus.Changed;
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
  //
  const getApprovalDetailInfo = async() => {
    if (!detail?.approvalId) return;
    const data = await getApprovalDetail({ id: detail?.approvalId });
    setApprovalDetail(data);
  };

  useEffect(() => {
    getApprovalDetailInfo();
  }, [detail?.approvalId]);

  return (
    <>
      <V2Drawer
        bodyStyle={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
        destroyOnClose
        open={open}
        onClose={() => setOpen(false)}
      >
        <V2Container
          // 容器上下padding 32， 所以减去就是64
          style={{ height: 'calc(100vh - 64px)' }}
          emitMainHeight={h => setMainHeight(h)}
          className={styles.container}
          extraContent={{
            top: (
              <div
                style={{
                  paddingRight: '40px',
                  paddingLeft: '40px',
                  paddingTop: '4px',
                }}
              >
                <V2Title
                  text={detail?.name}
                  extra={
                    <div className={cs(styles.extraButtons, styles.flexRow)}>
                      { showHistoryButton
                        ? <div className={cs(styles.historyBtn, styles.flexRow, 'ml-16')} onClick={historyHandle}>
                          <IconFont iconHref='iconic_lishirenwu' className={cs(styles.icon, 'mr-5')} />
                          <span className='fs-14 c-172'>历史任务</span>
                        </div> : <></>}
                      { showChangeButton && !hideOperate ? <Button type='primary' onClick={taskChangeHandle} className='ml-16'>开发异动</Button> : <></>}
                      { showApprovingButton ? <div className={styles.approvingBtn}>
                        <Button type='text' onClick={taskApprovingHandle} className='ml-16'>开发异动中</Button>
                      </div> : <></>}
                    </div>
                  }/>
                <div
                  className={styles.statusBox}
                  style={{
                    ...TaskStatusColor[detail?.status]
                  }}
                >{detail?.statusName}</div>
              </div>
            ),
          }}
        >
          <div>
            <Spin spinning={loading}>
              <TaskDetail
                mainHeight={mainHeight}
                detail={detail}
                aprDetail={approvalDetail}
                refresh={() => setRefresh(true)}
                open={open}
                hideOperate={hideOperate}
                style={{
                  paddingRight: '40px',
                  paddingLeft: '40px',
                }}
              />
            </Spin>
          </div>

          {/* 发起异动 */}
          <TaskChangeModal
            visible={changeVisible}
            setVisible={setChangeVisible}
            detail={detail}
            onRefresh={() => setRefresh(true)}
          />

          {/* 任务历史 */}
          <TaskHistory
            open={historyVisible}
            setOpen={setHistoryVisible}
            id={detail.id}/>
        </V2Container>
      </V2Drawer>
    </>
  );
};
export default TaskDetailDrawer;
