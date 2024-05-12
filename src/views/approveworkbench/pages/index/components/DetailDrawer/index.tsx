/**
 * @Description 审批详情抽屉
 */
import { FC, useEffect, useState, useRef } from 'react';
import { Space, Button } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Container from '@/common/components/Data/V2Container';
import ApprovalDialog from './ApprovalDialog';
import Detail from './Detail';
import { useMethods } from '@lhb/hook';
import {
  approvalDetail,
  shopEvaluationSimpleDetail,
  approvalPass,
  approvalDeny,
  approvalReject,
  approvalRevoke,
} from '@/common/api/approveworkbench';
import styles from './index.module.less';

interface DetailDrawerProps {
  id?: number; // 审批id
  tab: number; // 所属审批列表tab 1/2/3
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  onRefresh?: Function; // 刷新列表
}

const DetailDrawer: FC<DetailDrawerProps> = ({
  id,
  tab,
  open,
  setOpen,
  onRefresh,
}) => {
  const [aprDetail, setAprDetail] = useState<any>({}); // 审批详情
  const [detail, setDetail] = useState<any>({}); // 点位详情
  const [loading, setLoading] = useState<boolean>(true);
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false); // 审批意见输入框
  const [approvalEvent, setApprovalEvent] = useState('');
  const lockRef = useRef(false);

  useEffect(() => {
    if (open) {
      methods.getDetail();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const methods = useMethods({
    /**
     * @description 获取审批详情、点位详情
     */
    async getDetail() {
      setLoading(true);

      const data = await approvalDetail({ id, tab });
      setAprDetail(data);

      const detail = await shopEvaluationSimpleDetail({ id: data.relationId });
      setDetail(detail);

      setLoading(false);
    },

    handleApproval(event: string) {
      if (event === 'revoke') { // 撤回时直接请求
        methods.revokeApproval();
      } else { // 通过驳回拒绝时弹框
        setApprovalEvent(event);
        setApprovalVisible(true);
      }
    },

    // 撤销审批
    revokeApproval() {
      /*
        id 评估id
        relationType 审批类型（1开发异动申请、2点位保护申请、3店铺评估申请）
        typevalue 审批子类型（1选址转测评、2测评转选址、3终止任务、4变更责任人、5点位保护、6申请特例、7申请续签、8点位申请、9设计申请、10合同申请）
      */
      if (lockRef.current) return;
      lockRef.current = true;
      const { relationId, type, typeValue } = aprDetail;
      const params = {
        id: relationId,
        relationType: type,
        typeValue,
      };
      approvalRevoke(params).then(() => {
        V2Message.success('撤销成功');
        onRefresh && onRefresh();
        setOpen(false);
      }).finally(() => {
        lockRef.current = false;
      });

    },

    /**
     * @description 确认执行审批 通过/驳回/拒绝
     * @param event pass/deny/reject
     */
    async confirmApprovalDialog(event: string, reason: string) {
      if (lockRef.current) return;
      lockRef.current = true;

      let fetchMethod = approvalPass;
      switch (event) {
        // 拒绝
        case 'deny':
          fetchMethod = approvalDeny;
          break;
        // 驳回
        case 'reject':
          fetchMethod = approvalReject;
          break;
      }
      const params = {
        id: aprDetail.id,
        reason: reason,
        nodeCode: aprDetail.nodeCode
      };
      const res = await fetchMethod(params);
      lockRef.current = false;
      if (res) {
        V2Message.success('审批成功');
        onRefresh && onRefresh();
        setOpen(false);
      }
    },

    renderBottom() {
      return (Array.isArray(aprDetail.permissions) && !!aprDetail.permissions.length) ? <div className={styles.footerCon}>
        <Space size={12}>
          {aprDetail.permissions.map((itm, idx) => <Button
            key={idx}
            type={idx === aprDetail.permissions.length - 1 ? 'primary' : 'default'}
            onClick={() => methods.handleApproval(itm.event) }>{itm.name}</Button>)}
        </Space>
        <ApprovalDialog
          visible={approvalVisible}
          setVisible={setApprovalVisible}
          event={approvalEvent}
          onSubmit={methods.confirmApprovalDialog}/>
      </div> : <></>;
    }
  });

  return (
    <V2Drawer open={open} onClose={() => setOpen(false)} className={styles.approveDrawer} destroyOnClose>
      <V2Container
        style={{ height: '100vh' }}
        extraContent={{
          bottom: methods.renderBottom(),
        }}
      >
        <Detail
          loading={loading}
          aprDetail={aprDetail}
          detail={detail}
        />
      </V2Container>
    </V2Drawer>
  );
};

export default DetailDrawer;
