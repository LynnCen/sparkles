/**
 * @Description 拓店任务详情--异动审批信息
 */

import { FC, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import NodesDrawer from '@/common/components/business/ExpandStore/ApprovalNodes/components/NodesDrawer';
import { isNotEmptyAny, isArray } from '@lhb/func';
import { ApprovalStatus, ApprovePermission, ApprovePageNo, TaskChange, ApprovalTypeValue } from '@/common/components/business/ExpandStore/ts-config';
import UpdateManager from './components/UpdateManager';
import UpdateOffice from './components/UpdateOffice';
import styles from './index.module.less';

/** 状态颜色值 */
const statusColor = {
  [ApprovalStatus.Untreated]: '#FF861D', // #FF861D
  [ApprovalStatus.Passed]: '#009963',
  [ApprovalStatus.Denied]: '#F53F3F',
  [ApprovalStatus.Reject]: '#F53F3F',
};

const TaskDetailApproveInfo: FC<any> = forwardRef(({
  detail,
  aprDetail = {}, // 审批详情
}, ref) => {
  // 外部调用异动审批通过操作
  useImperativeHandle(ref, () => ({
    approveTaskChange: (cb) => {
      approveHandle(cb);
    },
  }));

  const [nodesDrawer, setNodesDrawer] = useState<any>({ open: false });
  const [managerVisible, setManagerVisible] = useState<boolean>(false);
  const [selManager, setSelManager] = useState<any>({});
  const [officeVisible, setOfficeVisible] = useState<boolean>(false);
  const [selOffice, setSelOffice] = useState<any>({});

  const { pageNo } = aprDetail || {}; // 特定异动审批结点表示符号

  // 是否展示该模块：a.拓店任务详情时，该拓店任务异动审批中则展示；b.异动审批详情时必定展示
  const showTaskChange = isNotEmptyAny(detail) && (TaskChange.Approving === detail.taskChangeApprovalStatus || isNotEmptyAny(aprDetail));

  // 是否跨公司调整
  // const isValueTypeChangeOffice = isNotEmptyAny(aprDetail) && aprDetail.typeValue === ApprovalTypeValue.ChangeOffice;

  // 是否有“通过”权限
  const hasPassPermission = useMemo(() => {
    if (!isNotEmptyAny(aprDetail)) return false;

    const { permissions } = aprDetail;
    return isArray(permissions) && !!permissions.find((itm: any) => itm.event === ApprovePermission.Approve);
  }, [aprDetail]);

  // 是否展示更换责任人：是审批详情+待审批+有审批权限+是特定的审批结点
  const isUpdateManagerPage = useMemo(() => {
    if (!isNotEmptyAny(aprDetail)) return false;

    return (aprDetail.status === ApprovalStatus.Untreated) && hasPassPermission && [ApprovePageNo.GHZRR001, ApprovePageNo.KFGSTZ003].includes(pageNo);
  }, [aprDetail]);

  // 是否更换分公司页面
  const isUpdateOfficePage = useMemo(() => {
    if (!isNotEmptyAny(aprDetail)) return false;

    return (aprDetail.status === ApprovalStatus.Untreated) && hasPassPermission && [ApprovePageNo.KFGSTZ001].includes(pageNo);
  }, [aprDetail]);

  /**
   * @description 开发异动审批通过操作
   * @param cb 回调处理，其中返回提交用特定参数
   * @return
   */
  const approveHandle = (cb) => {
    const { typeValue } = aprDetail;
    const params: any = {};
    if ([ApprovalTypeValue.TransferTask, ApprovalTypeValue.ChangeOffice].includes(typeValue)) {
      let hintMsg = '';
      if (isUpdateOfficePage && !selOffice.id) {
        hintMsg = '请先更换所属分公司';
      }
      if (isUpdateManagerPage && !selManager.id) {
        hintMsg = '请先更换开发经理';
      }
      if (hintMsg) {
        V2Message.warning(hintMsg);
        return;
      }

      // 变更责任人
      if (typeValue === ApprovalTypeValue.TransferTask && isUpdateManagerPage && selManager.id) {
        // 异动类型是申请更换责任人时
        params.employeeIds = [selManager.id];
      }
      // 助理角色时更换分公司
      if (typeValue === ApprovalTypeValue.ChangeOffice && isUpdateOfficePage && selOffice.id) {
        params.companyId = selOffice.id;
      }
      // 总监时的更换责任人
      if (typeValue === ApprovalTypeValue.ChangeOffice && isUpdateManagerPage && selManager.id) {
        params.managerId = selManager.id;
      }
    }
    cb && cb(params);
  };

  return (
    showTaskChange ? <div className='mb-16'>
      <div className={styles.approveBox}>
        <div className='fs-14'>
        发起
          <span className='ml-4 bold'>{isNotEmptyAny(aprDetail) ? aprDetail.typeValueName : detail.typeValueName}</span>
          <span className='ml-4'>流程</span>
          <span className='ml-6 c-ff8 bold' style={{ color: isNotEmptyAny(aprDetail) ? statusColor[aprDetail.status] : '#FF861D' }}>{isNotEmptyAny(aprDetail) ? aprDetail.statusName : detail.taskChangeApprovalStatusName}</span>
          <div className={styles.rightCon}>
            {isUpdateOfficePage ? <span
              onClick={() => setOfficeVisible(true)}
              className={styles.rightLine}
            >更换分公司</span> : <></>}
            {isUpdateManagerPage ? <span
              onClick={() => setManagerVisible(true)}
              className={styles.rightLine}
            >更换责任人</span> : <></>}
            <span
              onClick={() => setNodesDrawer((state) => ({ ...state, open: true }))}
            >查看详情</span>
          </div>
        </div>
      </div>


      {/* 审批结点 */}
      <NodesDrawer
        detail={aprDetail}
        nodes={(isNotEmptyAny(aprDetail) ? aprDetail.nodes : detail?.nodes) || []}
        open={nodesDrawer.open}
        setOpen={setNodesDrawer}/>

      {/* 选择责任人 */}
      <UpdateManager
        companyId={aprDetail?.companyId}
        open={managerVisible}
        setOpen={setManagerVisible}
        selManager={selManager}
        onConfirm={(mng) => setSelManager(mng)}/>

      {/* 选择分公司 */}
      <UpdateOffice
        open={officeVisible}
        setOpen={setOfficeVisible}
        selOffice={selOffice}
        onConfirm={(office) => setSelOffice(office)}/>
    </div> : <></>
  );
});

export default TaskDetailApproveInfo;
