/**
 * @Description 卡旺卡拓店任务详情
 * 1109 标准版数据迁移引用该组件，显示拓店任务详情内容
 */
import { FC, useEffect, useState } from 'react';
import V2Container from '@/common/components/Data/V2Container';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { getCircleTaskDetail } from '@/common/api/expandStore/expansionCircleTask';
import { Spin } from 'antd';
import CircleTaskDetail from '@/common/components/business/ExpandStore/CircleTaskDetail/index';
import styles from './index.module.less';
import { getApprovalDetail } from '@/common/api/expandStore/approveworkbench';
import Header from './components/Header';

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

const CircleTaskDetailDrawer: FC<Props> = ({
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
  const [approvalDetail, setApprovalDetail] = useState<any>(null);// 审批详情

  useEffect(() => {
    if (!id && !refresh) return;

    open && getTaskDetail();
    // 非打开抽屉时初次请求，是操作后刷新时，同时回调刷新外层
    (refresh && outterRefresh) && outterRefresh();
  }, [id, refresh, open]);

  const getTaskDetail = () => {
    setLoading(true);
    try {
      getCircleTaskDetail({ id }).then((res) => {
        setDetail(res);
        setRefresh(false); // 刷新结束
        setLoading(false);
      });
    } catch (error) {
      setRefresh(false);
      setLoading(false);
    }
  };

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
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 40,
          paddingRight: 58,
        }}
        destroyOnClose
        open={open}
        onClose={() => setOpen(false)}
      >
        <V2Container
          // 容器上下padding 32， 所以减去就是64
          style={{ height: '100vh' }}
          emitMainHeight={h => setMainHeight(h)}
          className={styles.container}
          extraContent={{
            top: <Header
              detail={detail}
              isHistory={isHistory}
              hideOperate={hideOperate}
              onRefresh={() => setRefresh(true)}
            />
          }}
        >
          <div>
            <Spin spinning={loading}>
              <CircleTaskDetail
                mainHeight={mainHeight}
                detail={detail}
                aprDetail={approvalDetail}
                refresh={() => setRefresh(true)}
                open={open}
                hideOperate={hideOperate}
              />
            </Spin>
          </div>
        </V2Container>
      </V2Drawer>
    </>
  );
};
export default CircleTaskDetailDrawer;
