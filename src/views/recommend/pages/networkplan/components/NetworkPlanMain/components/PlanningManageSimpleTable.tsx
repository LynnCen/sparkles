
/**
 * @Description 规划管理table
 */
import { FC, Fragment, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { Badge } from 'antd';
import { refactorPermissions, urlParams } from '@lhb/func';
import styles from '../index.module.less';
import V2Table from '@/common/components/Data/V2Table';
import { post } from '@/common/request';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { PlanStatusEnum, PlanningStatus, TabsEnums } from '../../../ts-config';
import V2Operate from '@/common/components/Others/V2Operate';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import { getSession, setSession } from '@lhb/cache';
import EmptyRender from './EmptyRender';
import Edit from '@/common/components/business/Edit';



const otherColumnConfig = {
  width: 120
};

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
  const [hasData, setHasData] = useState<boolean>(getSession('networkPlanHasData') || false); // 列表是否有数据
  const [checked, setChecked] = useState<boolean>(false); // 完成有无数据的检查
  const [tableData, setTableData] = useState<any>({}); // 规划管理
  const [editData, setEditData] = useState<any>({
    visible: !!isMapReturn && !isActive, // 当总部统计规划弹窗显示的时候返回不自动打开弹窗，防止出现三层弹窗的情况
    branchCompanyId,
    planId,
  }); // 总部统计规划管理弹窗

  const methods = useMethods({
    checkHasData() {
      // https://yapi.lanhanba.com/project/546/interface/api/60220
      post('/plan/hasData').then((res: boolean) => {
        setHasData(res);
        setChecked(true);
        setSession('networkPlanHasData', res);
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
    // 分公司名称点击
    handleBranchCompanyName(record: any) {
      const urlParams = {
        branchCompanyId: record.branchCompanyId,
        planId: record.planId,
        isBranch: false,
      };

      dispatchNavigate(`/recommend/networkplanstatistic?params=${encodeURI(JSON.stringify(urlParams))}`);
    },
    // 推荐商圈数点击
    handleRecommendedClusterNum(record: any) {
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
          // isHeadquartersView:1 之前的参数，应该是不需要再使用了，先注释
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
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
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
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        setEditData({
          ...record,
          planStatus: 1, // 带入总部已规划的状态
          // storeStatus: 1,
          visible: true,
        });
      }
    },
    // 总部规划门店数点击
    handleParentCompanyPlannedStoreNum(record: any) {
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        setEditData({
          ...record,
          planStatus: 1, // 带入总部已规划的状态
          visible: true,
        });
      }
    },
    // 分部规划总商圈数点击
    handleChildCompanyPlannedClusterNum(record: any) {
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        setEditData({
          ...record,
          // https://confluence.lanhanba.com/pages/viewpage.action?pageId=104595590 总部点击分公司规划数字，默认勾选分公司规划状态的已规划，筛选出分公司规划的清单。
          branchCompanyPlanStatus: 1, // 0 未规划 1 已规划
          visible: true,
        });
      }
    },
    // 分部规划开店数点击
    handleChildCompanyPlannedStoreNum(record: any) {
      // 总部规划管理-已生效或审批中跳转地图查看页--PlanStatusEnum.ACTIVE与isValid无法匹配，isValid情况下可能是已通过，按照之前逻辑写isValid
      if (record.isValid || [PlanStatusEnum.UNDER_APPROVAL].includes(record.status)) {
        const urlParams = {
          branchCompanyId: record.branchCompanyId,
          planId: record.planId,
          branchCompanyName: record.branchCompanyName,
          isActive: true,
        };
        dispatchNavigate(`/recommend/networkmap?params=${JSON.stringify(urlParams)}`);
      } else {
        setEditData({
          ...record,
          // https://confluence.lanhanba.com/pages/viewpage.action?pageId=104595590 总部点击分公司规划数字，默认勾选分公司规划状态的已规划，筛选出分公司规划的清单。
          branchCompanyPlanStatus: 1, // 0 未规划 1 已规划
          visible: true,
        });
      }
    },
    // 编辑规划
    handleEdit(record: any) {
      const params = {
        branchCompanyId: record.branchCompanyId,
        branchCompanyName: record.branchCompanyName,
        planId: record.planId
      };
      dispatchNavigate(`/recommend/networkbranchplanstatistics?params=${JSON.stringify(params)}`);
    },
    // 发送分公司
    handleSend(record: any) {
      // https://yapi.lanhanba.com/project/546/interface/api/60185
      const params = {
        id: record.id,
      };
      post('/plan/send', params).then(() => {
        this.onSearch();
        V2Message.success('发送成功！');
      });
    },
    // 重发分公司
    handleSendAgain(record: any) {
      V2Confirm({
        onSure: (modal: any) => {
          this.handleSend(record); // 走发送分公司逻辑
          modal.destroy();
        },
        content: '重新发送后，规划信息将根据最新操作发生变更。',
        title: '信息提示'
      });
    },
    // 应用版本
    handleApply(record: any) {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/546/interface/api/60192
          const params = {
            id: record.id,
            valid: true
          };
          post('/plan/updateValid', params).then(() => {
            this.onSearch();
            V2Message.success('应用成功！');
          });
          modal.destroy();
        },
        content: '是否应用版本？'
      });
    },
    // 撤销应用
    handleCancelApply(record: any) {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/546/interface/api/60192
          const params = {
            id: record.id,
            valid: false
          };
          post('/plan/updateValid', params).then(() => {
            this.onSearch();
            V2Message.success('撤销应用成功！');
          });
          modal.destroy();
        },
        content: '是否撤销应用版本？'
      });
    },
  });

  const defaultColumns: any[] = [
    {
      title: '分公司名称',
      dataIndex: 'branchCompanyName',
      key: 'branchCompanyName',
      dragChecked: true,
      width: 140,
      render: (text: string, record: any) => (
        <span className='c-006 pointer' onClick={() => methods.handleBranchCompanyName(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '规划状态',
      key: 'status',
      whiteTooltip: true,
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
      title: '总商圈数',
      dataIndex: 'recommendedClusterNum',
      key: 'recommendedClusterNum',
      dragChecked: true,
      ...otherColumnConfig,
      render: (text: number, record: any) => (
        <span className='c-006 pointer' onClick={() => methods.handleRecommendedClusterNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '总部已推荐商圈',
      dataIndex: 'parentCompanyPlannedClusterNum',
      key: 'parentCompanyPlannedClusterNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        <span className='c-006 pointer' onClick={() => methods.handleParentCompanyPlannedClusterNum(record)}>{text || '-'}</span>
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
      title: '预测目标值',
      dataIndex: 'predictTargetValue',
      key: 'predictTargetValue',
      dragChecked: true,
      width: 148,
      render: (text) => text || '-'
    },
    {
      title: '分部规划总商圈数',
      dataIndex: 'childCompanyPlannedClusterNum',
      key: 'childCompanyPlannedClusterNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        <span className='c-006 pointer' onClick={() => methods.handleChildCompanyPlannedClusterNum(record)}>{text || '-'}</span>
      ),
    },
    {
      title: '分部规划开店数',
      dataIndex: 'childCompanyPlannedStoreNum',
      key: 'childCompanyPlannedStoreNum',
      dragChecked: true,
      width: 148,
      render: (text: number, record: any) => (
        <span className='c-006 pointer' onClick={() => methods.handleChildCompanyPlannedStoreNum(record)}>{text || '-'}</span>
      ),
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
            if (i === 0) return <V2Table.Summary.Cell key={0} index={0} colSpan={2} align={'center'}>总计</V2Table.Summary.Cell>;
            // 分公司名称	规划状态 操作 这三个字段不需要总计
            if (['branchCompanyName', 'status', 'permissions'].includes(val.key)) return <Fragment key={val.key}/>;

            // 总计字段是在 table 的字段 Num 前加上 Total
            let renderValue = tableData[val.key.substring(0, val.key.length - 3) + 'Total' + val.key.substring(val.key.length - 3)];
            if (val.key === 'predictTargetValue') {
              renderValue = tableData.totalPredictTargetValue;
            }
            return <V2Table.Summary.Cell key={i} index={i} >
              <span>{renderValue || '-'}</span>
            </V2Table.Summary.Cell>;
          })
        }
        {/*
          一、因为上面过滤了3个，但是 permissions是悬浮的， 所以只需要过滤3 - 1 = 2个。
          不过第一列是 colSpan=2 ，所以这里再少补一个，也就是 2 - 1 = 1个
          最后还有一个是 v2Table 专属的 placeholder自适应列占位，所以需要再补充一个，也就是 1 + 1个。
          结果：1+1=2
          二、key={defaultColumns.length} index={defaultColumns.length}的设置
          只要谨记最后一列就是 defaultColumns.length，依次向上倒推即可。
        */}
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
        pageSize={100}
        pagination={false}
        // 重要：记得同步维护至 https://yapi.lanhanba.com/project/378/interface/api/46017
        // tableSortModule='consoleRecommendNetworkPlanPlanningManagement'
        scroll={{ y: mainHeight - 56 - 54 }}
        summary={() => onSummary()}
        className={styles.planningManageSimpleTable}
        hideColumnPlaceholder
      /> : <EmptyRender
        mainHeight={mainHeight}
        type={TabsEnums.HEAD_OFFICE}
        successCb={methods.checkHasData}
      />}

      <Edit
        originPath={'/networkplan'}// 规划管理
        detail={editData}
        setDetail={setEditData}
        onReset={methods.onSearch}
        isBranch={false}
        branchCompanyName={editData?.branchCompanyName}
      />
    </>
  );
};

export default PlanningManageSimpleTable;
