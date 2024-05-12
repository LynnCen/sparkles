/**
 * @Description 审批详情抽屉
 * 1109 -标准版数据迁移引用该组件，添加参数 hideOperate 隐藏审批相关按钮
 */
import { FC, useEffect, useState, useRef, useMemo } from 'react';
import { Spin } from 'antd';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import V2Container from '@/common/components/Data/V2Container';
import ApprovalDialog from './components/ApprovalDialog';
import Rebuttal from '@/common/components/business/ExpandStore/Rebuttal';
import { useMethods } from '@lhb/hook';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { getChancePointDetail } from '@/common/api/expandStore/chancepoint';
import { approvalReboot, chancepointApprovalDetail } from '@/common/api/expandStore/approveworkbench';
import { getCircleTaskDetail, getTaskInfo } from '@/common/api/expandStore/expansiontask';
import { tenantCheck } from '@/common/api/common';

import {
  counterSign,
  denyApproval,
  rebutApproval,
  getApprovalDetail,
  passApproval,
  revokeApproval,
  transfer,
} from '@/common/api/expandStore/approveworkbench';
import styles from './index.module.less';
import AddApprover from './components/AddApprover';
import TransferDialog from './components/TransferDialog';
import Title from './components/Title';
import DeatilInfo from '@/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/components/DeatilInfo';
import TaskDetail from '@/common/components/business/ExpandStore/TaskDeatil';
import CircleTaskDetail from '@/common/components/business/ExpandStore/CircleTaskDetail';
import V2Operate from '@/common/components/Others/V2Operate';
import FormDrawer from '@/common/components/business/ExpandStore/ChancePointDetail/components/FormDrawer';
// import { ChangePonitDetailType } from '@/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/type';
import {
  ApprovalType,
  ApprovalTypeValue,
  ApprovePermission,
  IS_DETAIL_EDIT_CHANCE,
} from '@/common/components/business/ExpandStore/ts-config';
import { isNotEmptyAny, refactorPermissions } from '@lhb/func';
import PlanSpotDetail from '@/common/components/business/ExpandStore/PlanSpotDetail';
import { getPlanSpotDetail } from '@/common/api/expandStore/planspot';
import TaskDetailTitle from './components/TaskDetailTitle';
import CircleTaskDetailHeader from '@/common/components/business/ExpandStore/CircleTaskDetailDrawer/components/Header';
import EnterDrawer from '@/views/recommend/pages/collectmap/RightCon/EnterDrawer';
import { getClusterDetail } from '@/common/api/networkplan';

interface DetailDrawerProps {
  id?: number; // 审批id
  open: boolean; // 是否打开抽屉
  setOpen: Function; // 设置是否打开抽屉
  onRefresh?: Function; // 刷新列表
  hideOperate?: boolean // 隐藏审批相关的按钮
}

const DetailDrawer: FC<DetailDrawerProps> = ({ id, open, setOpen, onRefresh, hideOperate = false }) => {
  const chanceFormRef = useRef(null);
  const titleHeightRef = useRef(0);
  const taskRef = useRef(null);

  const [mainHeight, setMainHeight] = useState<number>(0);
  const [aprDetail, setAprDetail] = useState<any>({}); // 审批详情
  const [ponitDetail, setPointDetail] = useState<any>(); // 点位详情
  const [taskDetail, setTaskDetail] = useState<any>(); // 任务详情
  const [planSpotDetail, setPlanSpotDetail] = useState<any>(); // 集客点详情
  const [passExtraParams, setPassExtraParams] = useState<any>({}); // 通过审批时的附加参数，开发异动通过时有（负责人、分公司）、机会点审批通过时有propertyValues
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTip, setLoadingTip] = useState<string>('');
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false); // 审批意见输入框
  const [rebuttalModal, setRebuttalModal] = useState<any>({ // 驳回弹窗
    open: false,
    data: null
  });
  const [approvalEvent, setApprovalEvent] = useState('');
  const [showAddApprover, setShowAddApprover] = useState<any>(false); // 会签弹窗
  const [showTransfer, setShowTransfer] = useState<any>(false); // 转交弹窗
  const lockRef = useRef(false);
  const [formDrawerData, setFormDrawerData] = useState<any>({
    open: false,
    templateId: '', // 模板id
    id: '', // 编辑时的id
  });
  const [refreshDetail, setRefreshDetail] = useState<number>(0);
  const [hintStr, setHintStr] = useState<string>('');
  const [hasEditableProperty, setHasEditableProperty] = useState<boolean>(false);

  const [enterDrawerOpen, setEnterDrawerOpen] = useState({
    visible: false,
    value: null
  });// 维护表单抽屉开关及详情数据
  const [taskTemplateCode, setTaskTemplateCode] = useState<string>('');

  useEffect(() => {
    getTaskConfig();
  }, []);

  const getTaskConfig = async () => {
    const taskConfig = await tenantCheck();
    setTaskTemplateCode(taskConfig?.taskTemplateCode);
  };

  useEffect(() => {
    if (open) {
      methods.getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, refreshDetail]);

  /**
   * @description 是否可编辑机会点表单
   * @return 启用编辑机会点，类型为机会点评估，同时具备编辑、通过权限
   */
  const canEditForm = useMemo(() => {
    const { permissions, typeValue } = aprDetail || {};
    if (hideOperate || !IS_DETAIL_EDIT_CHANCE || typeValue !== ApprovalTypeValue.ChancePointEvaluate) return false;

    const editTarget = permissions.find((itm: any) => itm.event === ApprovePermission.Edit); // 编辑权限
    const approveTarget = permissions.find((itm: any) => itm.event === ApprovePermission.Approve); // 通过权限
    const rebootTarget = permissions.find((itm: any) => itm.event === ApprovePermission.Reboot); // 重新提交权限
    // 添加了重新提交按钮权限的判断
    return !!editTarget && (!!approveTarget || !!rebootTarget);
  }, [aprDetail]);

  /**
   * @description 展示的权限按钮
   * @return 如果可以编辑机会点表单，将edit权限替换为保存按钮
   */
  const showPermissions = useMemo(() => {
    // console.log('useMemo showPermissions', aprDetail, hasEditableProperty);
    let refactorPerms = refactorPermissions(aprDetail.permissions);
    if (canEditForm) {
      // 如果可以页面内直接编辑表单
      if (hasEditableProperty) {
        // 有可编辑项目，将edit权限替换为保存按钮
        refactorPerms = refactorPerms.map((itm: any) =>
          itm.event === ApprovePermission.Edit ? { ...itm, name: '保存' } : itm
        );
      } else {
        // 无可编辑项目，去掉edit权限按钮
        refactorPerms = refactorPerms.filter((itm: any) => itm.event !== ApprovePermission.Edit);
      }
    }
    return refactorPerms;
  }, [aprDetail, hasEditableProperty]);

  // 打开详情页时的编辑表单的刷新详情页
  const updateHandle = () => {
    const curVal = refreshDetail + 1;
    setRefreshDetail(curVal);
  };
  const methods = useMethods({
    /**
     * @description 获取审批详情、点位详情
     */
    async getDetail() {
      setPointDetail(null);
      setTaskDetail(null);
      setPlanSpotDetail(null);
      setLoading(true);

      const data = await getApprovalDetail({ id }).catch(() => {
        setLoading(false);
      }); // 审批详情
      setAprDetail(data);
      // 注意，目前因为只有机会点类型，所以这里可以直接使用relationId，注意后续类型多的时候，需要判断type/typeValue
      // 注意:审批详情页请求的机会点详情接口，与机会点详情页不同

      const { type, typeValue, id: approvalId, relationId } = data;
      /*
        注意:机会点审批详情页请求的审批快照接口；
        店铺评估审批详情页请求的机会点详情接口
      */
      if (type === ApprovalType.ChancePoint) {
        // 机会点审批时请求机会点快照
        const detail = await chancepointApprovalDetail({ id: approvalId }).catch(() => {
          setLoading(false);
        });
        // 机会点详情
        setPointDetail(detail);
      } else if (type === ApprovalType.TaskChange) {
        // 拓店任务异动审批，获取任务详情
        const api = taskTemplateCode === 'clusterA' ? getCircleTaskDetail : getTaskInfo;
        const taskDtl = await api({ id: relationId }).catch(() => {
          setLoading(false);
        });
        // 任务详情
        setTaskDetail(taskDtl);
      } else if (type === ApprovalType.PlanSpot && typeValue === ApprovalTypeValue.PlanSpot) {
        // 集客点详情
        const detail = await getPlanSpotDetail({ id: approvalId }).catch(() => {
          setLoading(false);
        });
        const data = await getClusterDetail({ planClusterId: detail?.planClusterId }).catch(() => {
          setLoading(false);
        });

        // 集客点详情
        setPlanSpotDetail({
          ...detail,
          radius: data?.radius,
          polygon: data?.polygon
        });
      } else {
        // 点位评估详情
        const detail = await getChancePointDetail({ id: relationId }).catch(() => {
          setLoading(false);
        });
        // 机会点详情
        setPointDetail(detail);
      }
      setLoading(false);
    },
    // 通过审批
    handleApprove(val) {
      const { type } = aprDetail;
      if (canEditForm) {
        // 调用保存机会点，成功后再发起审批

        // saveHandle入参分别为needCheck，成功回调
        // 最终方法saveHandle在 src/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/Modules/ChanceForm/index.tsx
        setPassExtraParams({});
        (chanceFormRef?.current as any).saveChance(true, (propertyValues: any) => {
          console.log('通过机会点审批特定参数', propertyValues, val);
          setPassExtraParams({ propertyValues } || {});
          this.approveInner(val);
        });
      } else if (type === ApprovalType.TaskChange) {
        // 开发异动，检查并设置特定参数后发起审批
        setPassExtraParams({});
        (taskRef?.current as any).approveTaskChange((params: any) => {
          // console.log('通过异动检查', params, val);
          setPassExtraParams(params || {});
          this.approveInner(val);
        });
      } else {
        this.approveInner(val);
      }
    },
    approveInner(val) {
      setApprovalEvent(val.event);
      setApprovalVisible(true);
    },
    // 拒绝
    handleReject(val) {
      setApprovalEvent(val.event);
      setApprovalVisible(true);
    },
    // 驳回
    handleRebut(val) {
      setApprovalEvent(val.event);
      const { nodes, nodeCode } = aprDetail;
      // 判断运营后台的驳回配置，如果是允许用户自由驳回节点，使用setRebuttalModal，否则使用之前的驳回弹窗，驳回到指定节点
      const targetNode = nodes?.find((nodeItem: any) => nodeItem.nodeCode === nodeCode);
      if (targetNode) {
        const { alternateRejectNode } = targetNode;
        alternateRejectNode ? setRebuttalModal({
          open: true,
          data: {
            id: aprDetail.id,
            nodeCode: aprDetail.nodeCode,
          }
        }) : setApprovalVisible(true);
        return;
      }
      // 默认
      setApprovalVisible(true);
    },
    rebuttalModalClose() {
      setRebuttalModal({
        open: false,
        data: null
      });
    },
    rebuttalModalSuccess() {
      methods.refreshAndClose();
    },
    // 转交
    handleTransfer() {
      setShowTransfer(true);
    },
    // 加签
    handleCountersign() {
      setShowAddApprover(true);
    },
    // 编辑
    handleEdit() {
      const { type, typeValue } = aprDetail;

      // 可在详情页内直接编辑表单时，保存表单；页面内不可编辑时，去编辑页
      if (canEditForm) {
        // 调用保存机会点
        // saveHandle入参分别为needCheck，成功回调
        // 最终方法saveHandle在 src/common/components/business/ExpandStore/ChancePointDetail/components/Deatil/Modules/ChanceForm/index.tsx
        (chanceFormRef?.current as any).saveChance(true, () => {
          V2Message.success('保存成功');
          onRefresh && onRefresh();
        });
        return;
      }

      // 集客点不支持PC修改
      if (type === ApprovalType.PlanSpot && typeValue === ApprovalTypeValue.PlanSpot) {
        // V2Message.warning('PC暂不支持修改，请去App端操作');
        setEnterDrawerOpen({ visible: true, value: planSpotDetail });
        return;
      }
      setFormDrawerData({
        open: true,
        templateId: ponitDetail?.dynamicRelationId, // 模板id
        id: ponitDetail?.id, // 编辑时的id
      });
      // console.log('编辑');
    },
    // 撤回
    handleWithdraw() {
      if (lockRef.current) return;
      lockRef.current = true;
      const { id, type, typeValue } = aprDetail;
      const params = {
        id: id,
        relationType: type,
        typeValue: typeValue,
      };
      revokeApproval(params)
        .then(() => {
          V2Message.success('撤销成功');
          methods.refreshAndClose();
        })
        .finally(() => {
          lockRef.current = false;
        });
    },
    // 重新提交
    handleReboot() {
      V2Confirm({
        content: `确定要重新提交`,
        onSure() {
          approvalReboot({ id }).then(() => {
            V2Message.success('重新提交成功');
            methods.refreshAndClose();
          });
        }
      });
    },
    /**
     * @description 确认执行审批 通过/拒绝
     */
    async confirmApprovalDialog(event: string, reason: string) {
      if (lockRef.current) return;
      lockRef.current = true;

      let fetchMethod = passApproval; // 通过接口
      switch (event) {
        // 拒绝
        case 'reject':
          fetchMethod = denyApproval; // 拒绝
          break;
        case 'rebut':
          fetchMethod = rebutApproval; // 驳回
          break;
      }
      const params = {
        id: aprDetail.id,
        reason: reason,
        nodeCode: aprDetail.nodeCode,
        ...passExtraParams, // 通过审批时的附加参数
      };
      const res = await fetchMethod(params);
      lockRef.current = false;
      if (res) {
        V2Message.success('审批成功');
        methods.refreshAndClose();
      }
    },
    async handleAddApprover(val) {
      const res = await counterSign({
        id,
        nodeCode: aprDetail?.nodeCode,
        countersignIds: val?.approver,
        countersignType: val?.type,
        reason: val?.remark,
      });
      if (res) {
        V2Message.success('加签成功');
        methods.refreshAndClose();
      }
    },
    async handleTransferEvent(val) {
      const curNode = aprDetail?.nodes.filter(item => {
        item.nodeCode = aprDetail?.nodeCode;
      });
      const nodeId = curNode[0]?.nodeId;
      const res = await transfer({
        id,
        nodeId,
        nodeCode: aprDetail?.nodeCode,
        transferTo: val?.approver,
      });
      if (res) {
        V2Message.success('转交成功');
        methods.refreshAndClose();
      }
    },
    /**
     * @description 集客点编辑成功后刷新当前详情，及外层页面
     */
    handleEditPlanSpotDetailSuccess() {
      onRefresh && onRefresh();
      this.getDetail();
    },

    /**
     * @description 刷新组件外处理并关闭抽屉
     * 审批操作后，因为后端的审批状态更新处理较慢，为了获取到最新的审批状态，这里0.5秒后延时关闭
     */
    refreshAndClose() {
      setLoadingTip('审批处理中');
      setLoading(true);
      setTimeout(() => {
        setLoadingTip('');
        setLoading(false);
        onRefresh && onRefresh();
        setOpen(false);
      }, 500);
    },

    renderBottom() {
      return Array.isArray(aprDetail.permissions) && !!aprDetail.permissions.length ? (
        <div className={styles.footerCon}>
          <V2Operate
            operateList={showPermissions?.map(item => ({
              ...item,
              type: 'primary',
            }))}
            showBtnCount={aprDetail.permissions.length}
            onClick={btn => methods[btn.func](btn)}
          />
          {/* 通过与不通过弹窗 */}
          <ApprovalDialog
            visible={approvalVisible}
            setVisible={setApprovalVisible}
            event={approvalEvent}
            onSubmit={methods.confirmApprovalDialog}
          />
          {/* 驳回弹窗 */}
          <Rebuttal
            modalData={rebuttalModal}
            close={methods.rebuttalModalClose}
            success={methods.rebuttalModalSuccess}
          />
          {/* 加签弹窗 */}
          <AddApprover
            visible={showAddApprover}
            setVisible={setShowAddApprover}
            onSubmit={methods.handleAddApprover}
          />
          {/* 转交弹窗 */}
          <TransferDialog
            visible={showTransfer}
            setVisible={setShowTransfer}
            onSubmit={methods.handleTransferEvent}
          />
        </div>
      ) : (
        <></>
      );
    },
    renderChildren: () => {
      // 渲染机会点详情各个模块
      if (ponitDetail) {
        return <DeatilInfo
          ref={chanceFormRef}
          canEditForm={canEditForm}
          hideOperate={hideOperate}
          isApproval
          approvalId={aprDetail.id}
          detail={ponitDetail}
          titleHeightRef={titleHeightRef}
          update={updateHandle}
          setHintStr={setHintStr}
          setHasEditableProperty={setHasEditableProperty}
        />;
      }
      // 渲染拓店任务详情
      if (taskDetail) {
        return taskTemplateCode === 'clusterA' ? <CircleTaskDetail
          ref={taskRef}
          detail={taskDetail}
          refresh={() => onRefresh && onRefresh()}
          isApproval
          aprDetail={aprDetail}
        /> : <TaskDetail
          ref={taskRef}
          detail={taskDetail}
          refresh={() => onRefresh && onRefresh()}
          isApproval
          aprDetail={aprDetail}
        />;
      }
      // 渲染集客点审批详情
      if (planSpotDetail) {
        return <PlanSpotDetail
          isApproval
          aprDetail={aprDetail}
          detail={planSpotDetail}
          refresh={() => onRefresh && onRefresh()}
        />;
      }
      return <></>;
    }
  });

  return (
    <V2Drawer
      open={open}
      onClose={() => setOpen(false)}
      className={styles.approveDrawer}
      destroyOnClose
    >
      <>
        <Spin spinning={loading} tip={loadingTip}>
          <V2Container
            style={{ height: '100vh' }}
            emitMainHeight={setMainHeight}
            extraContent={{
              top: <div className={styles.top}>
                {
                  taskDetail
                    ? (taskTemplateCode === 'clusterA' ? <CircleTaskDetailHeader
                      detail={taskDetail}
                      hideOperate={true}
                      isApproval
                    /> : <TaskDetailTitle
                      titleHeightRef={titleHeightRef}
                      detail={taskDetail}
                    />)
                    : <Title
                      detail={aprDetail}
                      titleHeightRef={titleHeightRef}
                      hideNodes={isNotEmptyAny(planSpotDetail)}
                      hintStr={hintStr}/>
                }
              </div>,
              bottom: !hideOperate ? methods.renderBottom() : <></>,
            }}
          >
            <div
              className={styles.body}
              style={{
                height: mainHeight || 'auto',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
              {methods.renderChildren()}
            </div>
            {/* <div className={styles.detailContainer}>
            <Spin spinning={loading}>
              {taskDetail
                ? <TaskDetailTitle
                  titleHeightRef={titleHeightRef}
                  detail={taskDetail}
                />
                : <Title
                  detail={aprDetail}
                  titleHeightRef={titleHeightRef}
                  hideNodes={isNotEmptyAny(planSpotDetail)}
                  hintStr={hintStr}/> }


              {ponitDetail && (
                <DeatilInfo
                  ref={chanceFormRef}
                  canEditForm={canEditForm}
                  hideOperate={hideOperate}
                  isApproval
                  approvalId={aprDetail.id}
                  detail={ponitDetail}
                  titleHeightRef={titleHeightRef}
                  update={updateHandle}
                  setHintStr={setHintStr}
                  setHasEditableProperty={setHasEditableProperty}
                />
              )}

              {taskDetail && (
                <TaskDetail
                  ref={taskRef}
                  detail={taskDetail}
                  refresh={() => onRefresh && onRefresh()}
                  isApproval
                  aprDetail={aprDetail}
                />
              )}

              {planSpotDetail && (
                <PlanSpotDetail
                  isApproval
                  aprDetail={aprDetail}
                  detail={planSpotDetail}
                  refresh={() => onRefresh && onRefresh()}
                />
              )}

              <FormDrawer
                drawerData={formDrawerData}
                onSearch={onRefresh}
                update={updateHandle}
                closeHandle={() =>
                  setFormDrawerData({
                    open: false,
                    templateId: '', // 模板id
                    id: '', // 编辑时的id
                  })
                }
              />
            </Spin>
          </div> */}
          </V2Container>
        </Spin>

        {/* 审批详情中编辑机会点 */}
        <FormDrawer
          drawerData={formDrawerData}
          onSearch={onRefresh}
          update={updateHandle}
          closeHandle={() =>
            setFormDrawerData({
              open: false,
              templateId: '', // 模板id
              id: '', // 编辑时的id
            })
          }
        />

        <EnterDrawer open={enterDrawerOpen} setOpen={setEnterDrawerOpen} onRefresh={() => methods.handleEditPlanSpotDetailSuccess()}/>

      </>
    </V2Drawer>
  );
};

export default DetailDrawer;
