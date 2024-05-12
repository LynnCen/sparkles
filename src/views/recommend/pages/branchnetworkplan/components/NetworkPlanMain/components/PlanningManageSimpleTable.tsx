/**
 * @Description 规划管理table
 */
import { FC, Fragment, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Badge } from 'antd';
import { getSession, setSession } from '@lhb/cache';
import { refactorPermissions, urlParams } from '@lhb/func';
import styles from '../index.module.less';
import V2Table from '@/common/components/Data/V2Table';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { post } from '@/common/request';
import Edit from 'src/common/components/business/Edit';
import EmptyRender from '@/views/recommend/pages/networkplan/components/NetworkPlanMain/components/EmptyRender';
import { TabsEnums } from '@/views/recommend/pages/networkplan/ts-config';
import { PlanStatusEnum, PlanningStatus } from '../../../ts-config';
import ApprovalModal from './ApprovalModal';
import V2Operate from '@/common/components/Others/V2Operate';
import { dispatchNavigate } from '@/common/document-event/dispatch';


const PlanningManageSimpleTable: FC<any> = ({
  mainHeight,
}) => {
  const {
    branchCompanyId,
    planId,
    isMapReturn,
    isActive
  } = JSON.parse(decodeURI(urlParams(location.search)?.params || null)) || {};

  const [filters, setFilters] = useState<{ [x: string]: string }>({});
  const [hasData, setHasData] = useState<boolean>(getSession('branchNetworkPlanHasData') || false); // 列表是否有数据
  const [checked, setChecked] = useState<boolean>(false); // 完成有无数据的检查
  const [tableData, setTableData] = useState<any>({});// 规划管理
  const [editData, setEditData] = useState<any>({
    visible: !!isMapReturn && !isActive,
    branchCompanyId,
    planId,
  }); // 规划管理弹窗
  const [approvalModalData, setApprovalModal] = useState<any>({
    visible: false
  }); // 提交审批弹窗


  const methods = useMethods({
    checkHasData() {
      // https://yapi.lanhanba.com/project/546/interface/api/60220
      post('/plan/hasData').then((res: boolean) => {
        setHasData(res);
        setChecked(true);
        setSession('branchNetworkPlanHasData', res);
      });
    },
    // filter变化的时候执行请求接口的操作
    async loadData() {
      // https://yapi.lanhanba.com/project/546/interface/api/59779
      const res: any = await post('/plan/list', {}, { needCancel: false, });
      setTableData(res);

      return {
        dataSource: res.branchCompanyPlanList || [],
        count: res.branchCompanyPlanList.length,
      };
    },
    onSearch() {
      setFilters({ ...filters });
    },
    // 点击分公司名称
    handleBranchCompanyName(record) {
      const urlParams = {
        branchCompanyId: record.branchCompanyId,
        planId: record.planId,
        isBranch: true,
      };
      dispatchNavigate(`/recommend/networkplanstatistic?params=${encodeURI(JSON.stringify(urlParams))}`);
    },
    // 推荐商圈数点击
    handleRecommendedClusterNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          visible: true,
        });
      }
    },
    // 推荐门店数点击
    handleRecommendedStoreNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          visible: true,
        });
      }
    },
    // 总部规划商圈数点击
    handleParentCompanyPlannedClusterNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          parentCompanyPlanned: 1,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          visible: true,
        });
      }
    },
    // 总部规划门店数点击
    handleParentCompanyPlannedStoreNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          parentCompanyPlanned: 1,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          visible: true,
        });
      }
    },
    // 分部规划总商圈数点击
    handleChildCompanyPlannedClusterNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          childCompanyPlanned: 1,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          planStatus: 1, // 带入总部已规划的状态
          visible: true,
        });
      }
    },
    // 分部规划开店数点击
    handleChildCompanyPlannedStoreNum(record: any) {
      // 分公司部规划管理-已生效、审批中、已通过跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL, PlanStatusEnum.PASSED].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          childCompanyPlanned: 1,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          isBranch: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        // 不需要做赛选
        setEditData({
          ...record,
          visible: true,
        });
      }
    },
    // 编辑规划
    handleEdit(record: any) {
      setEditData({
        ...record,
        visible: true,
      });
    },
    // 提交审批
    handleSubmitApproval(record: any) {
      setApprovalModal({
        ...approvalModalData,
        visible: true,
        id: record.id
      });
    },
    // 撤回审批
    handleRevocationApproval(record: any) {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/532/interface/api/55677
          const params = {
            relationId: record.id,
            relationType: 8,
            typeValue: 15
          };
          post('/approval/revoke', params).then(() => {
            this.onSearch();
            V2Message.success('撤销成功！');
          });
          modal.destroy();
        },
        content: '是否撤销审批？'
      });
    },
    handleAddPLanCluster(record:any) {
      const urlParams = {
        branchCompanyId: record.branchCompanyId,
        planId: record.planId,
        parentCompanyPlanned: 1,
        branchCompanyName: record.branchCompanyName,
        id: record.id,
        isActive: true,
      };
      dispatchNavigate(`/recommend/addproject?params=${JSON.stringify(urlParams)}`);
    },
    handleAddPLanClusterRevocation(record:any) {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/532/interface/api/55677
          const params = {
            relationId: record.id,
            relationType: 8,
            typeValue: 17
          };
          post('/approval/revoke', params).then(() => {
            methods.onSearch();
            V2Message.success('撤销成功！');
          });
          modal.destroy();
        },
        content: '是否撤销审批？'
      });
    }
  });

  const defaultColumns: any[] = [
    {
      title: '分公司名称',
      dataIndex: 'branchCompanyName',
      key: 'branchCompanyName',
      dragChecked: true,
      width: 140,
      render: (val, record) => <span
        className='c-006 pointer'
        onClick={() => methods.handleBranchCompanyName(record)}
      >{val || '-'}</span>
    },
    {
      title: '总部规划商圈数',
      dataIndex: 'parentCompanyPlannedClusterNum',
      key: 'parentCompanyPlannedClusterNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        // <V2DetailGroup moduleType='easy'>
        //   <V2DetailItem noStyle value={text} type='link' onClick={() => methods.handleParentCompanyPlannedClusterNum(record)} />
        // </V2DetailGroup>
        <span className='c-006 pointer' onClick={() => methods.handleParentCompanyPlannedClusterNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '总部规划门店数',
      dataIndex: 'parentCompanyPlannedStoreNum',
      key: 'parentCompanyPlannedStoreNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        // <V2DetailGroup moduleType='easy'>
        //   <V2DetailItem noStyle value={text} type='link' onClick={() => methods.handleParentCompanyPlannedStoreNum(record)} />
        // </V2DetailGroup>
        <span className='c-006 pointer' onClick={() => methods.handleParentCompanyPlannedStoreNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '分部规划总商圈数',
      dataIndex: 'childCompanyPlannedClusterNum',
      key: 'childCompanyPlannedClusterNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        // <V2DetailGroup moduleType='easy'>
        //   <V2DetailItem noStyle value={text} type='link' onClick={() => methods.handleChildCompanyPlannedClusterNum(record)} />
        // </V2DetailGroup>
        <span className='c-006 pointer' onClick={() => methods.handleChildCompanyPlannedClusterNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '分公司规划开店数',
      dataIndex: 'childCompanyPlannedStoreNum',
      key: 'childCompanyPlannedStoreNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        // <V2DetailGroup moduleType='easy'>
        //   <V2DetailItem noStyle value={text} type='link' onClick={() => methods.handleChildCompanyPlannedStoreNum(record)} />
        // </V2DetailGroup>
        <span className='c-006 pointer' onClick={() => methods.handleChildCompanyPlannedStoreNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '预测市场容量',
      dataIndex: 'circleCapacityNum',
      key: 'circleCapacityNum',
      dragChecked: true,
      width: 148,
      render: (text) => text || '-'
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      dragChecked: true,
      width: 140,
      render: (_: string, record: any) => {
        // 生效中和其他六个状态在后端不是一个逻辑，所以需要特殊处理
        let status = record.status;
        if (record.isValid) status = 7;
        return <Badge color={PlanningStatus[status].color} text={PlanningStatus[status].text} />;
      }
    },
    {
      title: '操作',
      dataIndex: 'permissions',
      key: 'permissions',
      fixed: 'right',
      dragChecked: true,
      width: 220,
      render: (val: any[], record: any) => (
        <V2Operate
          showBtnCount={2}
          operateList={refactorPermissions(val)}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];

  // table 的总计栏
  const onSummary = () => {

    return <V2Table.Summary fixed>
      <V2Table.Summary.Row>
        {defaultColumns
          .map((val, i) => {
            if (i === 0) return <V2Table.Summary.Cell key={0} index={0} colSpan={1} align={'center'}>总计</V2Table.Summary.Cell>;
            // 分公司名称	规划状态 操作 这三个字段不需要总计
            if (['planName', 'branchCompanyName', 'status', 'permissions'].includes(val.key)) return <Fragment key={val.key}/>;

            // 总计字段是在 table 的字段 Num 前加上 Total
            const renderValue = tableData[val.key.substring(0, val.key.length - 3) + 'Total' + val.key.substring(val.key.length - 3)];
            return <V2Table.Summary.Cell key={i} index={i} >
              {/* <V2DetailGroup moduleType='easy'>
                <V2DetailItem noStyle value={renderValue} />
              </V2DetailGroup> */}
              <span>{renderValue || '-'}</span>
            </V2Table.Summary.Cell>;
          })
        }
        {/*
          一、因为上面过滤了4个，但是 permissions是悬浮的， 所以只需要过滤4 - 1 = 3个。
          不过第一列是 colSpan=2 ，所以这里再少补一个，也就是 3 - 1 = 2个
          最后还有一个是 v2Table 专属的 placeholder自适应列占位，所以需要再补充一个，也就是 2 + 1个。
          结果：4-1-1+1=3
          二、key={defaultColumns.length} index={defaultColumns.length}的设置
          只要谨记最后一列就是 defaultColumns.length，依次向上倒推即可。
        */}
        <V2Table.Summary.Cell key={defaultColumns.length - 2} index={defaultColumns.length - 2}></V2Table.Summary.Cell>
        <V2Table.Summary.Cell key={defaultColumns.length - 1} index={defaultColumns.length - 1}></V2Table.Summary.Cell>
        <V2Table.Summary.Cell key={defaultColumns.length} index={defaultColumns.length}></V2Table.Summary.Cell>
      </V2Table.Summary.Row>
    </V2Table.Summary>;
  };

  useEffect(() => {
    if (!hasData) {
      methods.checkHasData();
    } else {
      setChecked(true);
    }
  }, []);

  return (
    <>
      {!checked || hasData ? <V2Table
        rowKey='id'
        filters={filters}
        onFetch={methods.loadData}
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        pageSize={100}
        pagination={false}
        // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
        // tableSortModule='consoleRecommendNetworkPlanPlanningManagement'
        scroll={{ y: mainHeight - 56 - 54 }}
        summary={() => onSummary()}
        className={styles.planningManageSimpleTable}
      /> : <EmptyRender
        mainHeight={mainHeight}
        type={TabsEnums.BRANCH}
      />}

      <Edit
        originPath={'/branchnetworkplan'}// 分公司规划管理
        detail={editData}
        setDetail={setEditData}
        onReset={methods.onSearch}
        branchCompanyName={editData.branchCompanyName}
        isBranch={true}/>
      <ApprovalModal modalData={approvalModalData} setModalData={setApprovalModal} successCb={methods.onSearch} />
    </>
  );
};

export default PlanningManageSimpleTable;
