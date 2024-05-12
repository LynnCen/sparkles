import { FC, useState } from 'react';

import Operate from '@/common/components/Operate';
import { valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request/index';
import { useMethods } from '@lhb/hook';
import VideoList from './Modal/VideoList';
import { message, Modal, Spin, Typography } from 'antd';
import { immediatelyAnalysis } from '@/common/api/footprinting';
import { AnalysisStatusEnum } from '../ts-config';
import V2Table from '@/common/components/Data/V2Table';
import { downloadFile, getKeysFromObjectArray, refactorPermissions, replaceEmpty } from '@lhb/func';
import ImportReport from '@/views/passengerFlow/pages/footprinting/components/Modal/ImportReport';
import ReviewDetail from '../../reviewdetail/entry';
import IconFont from '@/common/components/Base/IconFont';

import styles from './entry.module.less';
import PermissionSelector from '@/common/components/Modal/PermissionSelector';
import { PermissionSelectorValues } from '@/common/components/Modal/ts-config';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const { Text } = Typography;


const defaultRender = { width: 130, dragChecked: true, render: (value: number | string) => valueFormat(value) };

interface Props {
  setEditTask: Function;
  setAssignTask: Function;
  setTaskDetail: Function;
  setModalData: Function;
  searchParams: object;
  refreshCurrent: boolean;
  selectionChange: Function;
  rowSelection: Array<any>;
  onSearch: Function;
  mainHeight?: number;
}

const TaskList: FC<Props> = ({
  setEditTask,
  setAssignTask,
  setTaskDetail,
  setModalData,
  searchParams,
  refreshCurrent = false,
  selectionChange,
  rowSelection,
  onSearch,
  mainHeight = 0,
}) => {
  const [reviewDetailData, setReviewDetailData] = useState<any>({
    visible: false,
    id: '', // 踩点任务id
  }); // 踩点任务详情

  // 选择成员
  const [chooseUserValues, setChooseUserValues] = useState<PermissionSelectorValues>({
    visible: false,
    users: [],
    id: undefined,
    name: '',
  });

  // const scrollHeight = useClientSize().height - 260;
  const columns = [
    { title: '任务码', key: 'projectCode', width: 130, fixed: 'left', dragChecked: true, dragDisabled: true },
    { title: '设备码', key: 'deviceCode', ...defaultRender, width: 220, },
    { title: '租户名称/团队名称', key: 'tenantName', width: 150, dragChecked: true, },
    { title: '需求品牌', key: 'demandBrandName', ...defaultRender },
    { title: '所属行业', key: 'industryName', ...defaultRender },
    {
      title: '需求城市',
      key: 'provinceName',
      width: 130,
      dragChecked: true,
      render: (value: string, record) => renderProvince(value, record),
    },
    { title: '店铺类型', key: 'shopCategoryName', ...defaultRender },
    { title: '店铺名称', key: 'shopName', ...defaultRender },
    { title: '店铺位置', key: 'address', ...defaultRender },
    { title: '所属场地', key: 'placeName', ...defaultRender },
    { title: '场地类型', key: 'placeCategoryName', ...defaultRender },
    { title: '详细地址', key: 'placeAddress', ...defaultRender },
    { title: '踩点日期', key: 'checkDate', ...defaultRender },
    {
      title: '踩点时段',
      key: 'checkPeriod',
      dragChecked: true,
      render: (value: any, record) => renderCheckDate(value, record),
    },
    {
      title: '任务跟进人',
      key: 'follows',
      dragChecked: true,
      render: (value: any, record) => renderFollows(value, record, record.permissions.find(item => item.event === 'checkSpot:projectEdit')),
      staticTooltipTitle: (value: any, record) => renderFollows(value, record),
    },
    { title: '踩点总时长(H)', key: 'checkDuration', ...defaultRender },
    { title: '踩点方式', key: 'checkWayName', ...defaultRender },
    { title: '踩点人员', key: 'checkerName', ...defaultRender },
    { title: '手机号码', key: 'checkerPhone', ...defaultRender },
    {
      title: '踩点状态',
      key: 'processName',
      dragChecked: true,
      render: (value: any, record) => {
        if (record.analysisStatus === AnalysisStatusEnum.NO_CREATE) {
          return record.processName;
        } else {
          return record.processName + ',' + record.analysisStatusName;
        }
      },
    },
    { title: '备注', key: 'remark', ...defaultRender },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 300,
      whiteTooltip: true,
      dragChecked: true,
      dragDisabled: true,
      render: (value: any, record) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value || [])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const [videoDetail, setVideoDetail] = useState<{ visible: boolean; id?: number }>({ visible: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [importModelActive, setImportModelActive] = useState<boolean>(false);
  const [targetInfo, setTargetInfo] = useState<any>({
    id: '',
    projectCode: ''
  });

  // 区域展示
  const renderProvince = (value: string, record: { provinceName: string; city: string; district: string }) => {
    if (!value) return '-';
    return `${record.provinceName || ''}${record.city && record.provinceName !== record.city ? record.city : ''}${
      record.district || ''
    }`;
  };

  // 拼接时间和时间段展示
  const renderCheckDate = (value: string, record: any) => {
    if (!record.checkDate) return '-';
    if (Array.isArray(value) && value.length) {
      return value.reduce((sum: any, cur: { start: string; end: string }) => {
        return `${sum} ${record.checkDate} ${cur.start}-${cur.end}`;
      }, '') as string;
    }
    return record.checkDate;
  };

  // 拼接跟进人
  const renderFollows = (value: [], record: { id:Number, follows: any[] }, showEdit:boolean = false) => {
    const { follows } = record;
    return <div className={styles.followRows}>
      <Text
        style={{ width: 200 } }
        ellipsis={ { tooltip: getKeysFromObjectArray(follows, 'name').join('、') }}
      >
        {replaceEmpty(getKeysFromObjectArray(follows, 'name').join('、'))}
      </Text>
      {showEdit && <IconFont
        iconHref='pc-common-icon-ic_edit'
        className={styles.editIcon}
        onClick={() => checkPartner(record.id, record.follows)}/>}
    </div>;
  };

  const { ...methods } = useMethods({
    handleProjectEdit(record: any) {
      setEditTask({
        visible: true,
        id: record.id,
        tenantName: record.tenantName,
        projectCode: record.projectCode,
        demandBrandName: record.demandBrandName,
        placeName: record.placeName,
      });
    },
    handleProjectDetail(record: any) {
      setTaskDetail({
        visible: true,
        id: record.id,
      });
    },
    handleProjectAllot(record: any) {
      if (!record.checkDate || record.checkDate === '') {
        message.warning('踩点日期未填写');
        return;
      }
      setAssignTask({
        visible: true,
        id: record.id,
        checkWay: record.checkWay,
        checkerName: record.checkerName,
        checkerPhone: record.checkerPhone,
      });
    },
    /** 设置规则 */
    handleCheckPointsSet(record: any) {
      if (record.hasRelationSpot) {
        setModalData({
          visible: true,
          id: record.id,
          filterAlreadySetVideos: false,
        });
      } else {
        V2Confirm({
          onSure: (modal: any) => {
            modal.destroy();
            methods.handleProjectEdit(record);
          },
          content: '当前踩点任务未关联点位，请先关联后再设置规则',
          okText: '立即前往'
        });
      }
    },
    handleProjectReport(record: any) {
      setVideoDetail({
        visible: true,
        id: record.id,
      });
    },
    handleProjectAnalysis(record: any) {
      // 立即分析
      const { id, nonCheckPointsCount } = record;
      const _nonCheckPointsCount = isNaN(Number(nonCheckPointsCount)) ? 0 : Number(nonCheckPointsCount);

      const request = () => {
        immediatelyAnalysis({ id }).then(() => {
          onSearch(); // 更新列表
        });
      };

      if (_nonCheckPointsCount !== 0) {
        const content = `该踩点任务存在${nonCheckPointsCount}个视频未绘制分析区域，请确认是否将已绘制分析区域的视频进行分析`;
        Modal.confirm({
          title: `提示`,
          content,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            request();
          },
        });
      } else {
        request();
      }
    },
    /**
     * 查看规则
     * 与设置规则功能一致，后期产品会调整
     */
    handleCheckPointsView(record: any) {
      if (record.hasRelationSpot) {
        setModalData({
          visible: true,
          id: record.id,
          filterAlreadySetVideos: true,
        });
      } else {
        V2Confirm({
          onSure: (modal: any) => {
            modal.destroy();
            methods.handleProjectEdit(record);
          },
          content: '当前踩点任务未关联点位，请先关联后再设置规则',
          okText: '立即前往'
        });
      }
    },

    handleReviewDetail(record: any) {
      // 没懂这里为什么关闭videoDetail
      setVideoDetail({
        visible: false,
        id: record.id,
      });
      setReviewDetailData({
        visible: true,
        id: record.id,
      });
    },
    handleReviewPPT(record: any) {
      setLoading(true);
      // 本地环境默认使用 ie环境地址
      const url:string = process.env.NODE_ENV === 'development' ? `https://ie-admin.lanhanba.net/pdf/insight` : `${window.location.origin}/pdf/insight`;
      const params = {
        id: record.id,
        url: url
      };
      //   导出分析报告
      //   https://yapi.lanhanba.com/project/329/interface/api/39990
      post('/checkSpot/review/exportUrl', params, {
        proxyApi: '/blaster',
        needHint: true
      })
        .then(({ url }) => {
          downloadFile({ url });
        })
        .finally(() => { setLoading(false); });
    },
    handleImportDeliveryReport(row: any) {
      const { id, projectCode } = row;
      setImportModelActive(true);
      setTargetInfo({ id, projectCode });
    }
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/462/interface/api/53892
    const { objectList, totalNum } = await post('/checkSpot/project/pages', params, {
      proxyApi: '/blaster',
      needHint: true,
      // isMock: true,
      // mockId: 329
    });
    return {
      dataSource: objectList || [],
      count: totalNum || 0,
    };
  };

  const onCloseModal = () => {
    setVideoDetail({ visible: false });
  };

  const onImportDialogClose = () => {
    setImportModelActive(false);
  };

  const onOk = () => {
  };

  // 选择任务跟进人
  const checkPartner = (id, users:any[]) => {
    setChooseUserValues({ ...chooseUserValues, users, id, visible: true });
  };

  // 确定选择任务跟进人
  const onOkSelector = ({ users, visible }: PermissionSelectorValues) => {
    if (!users.length) {
      message.error('请选择任务跟进人');
    } else if (users.length > 10) {
      message.warning('最多只能选择10个跟进人');
    } else {
      setChooseUserValues({ users, visible });
      const params = {
        id: chooseUserValues.id,
        followIds: users.map((item: any) => item.id),
      };
      // https://yapi.lanhanba.com/project/462/interface/api/67885
      post('/checkSpot/project/update/follow', params, { proxyApi: '/blaster' }).then(() => {
        onSearch();
        message.success('跟进人设置成功');
      });
    }

  };

  return (
    <>
      <Spin spinning={loading}>
        <V2Table
          tableSortModule='passengerFlowFootPrintingTaskList'
          rowKey='id'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: rowSelection.map((item) => item.id),
            onChange: (selectedRowKeys, selectedRows) => selectionChange(selectedRows),
          }}
          refreshCurrent={refreshCurrent}
          filters={searchParams}
          // 勿删! 64：分页模块总大小、42是table头部
          scroll={{ y: mainHeight - 64 - 42 }}
          defaultColumns={columns}
          onFetch={loadData}
          useResizable
          className={styles.taskList}
        />
        <VideoList videoDetail={videoDetail} onCloseModal={onCloseModal} />
        <ImportReport visible={importModelActive} onCloseModal={onImportDialogClose} onOkExport={onOk} targetInfo={targetInfo} />
      </Spin>
      <ReviewDetail drawerData={reviewDetailData} setDrawerData={setReviewDetailData}/>
      <PermissionSelector
        title={`选择用户`}
        type='MORE'
        values={chooseUserValues}
        onClose={setChooseUserValues}
        onOk={onOkSelector}
      />
    </>
  );
};

export default TaskList;
