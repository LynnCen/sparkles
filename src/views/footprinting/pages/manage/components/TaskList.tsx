import { FC, useState } from 'react';
// import Table from '@/common/components/FilterTable';

import Operate from '@/common/components/Operate';
import { valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request/index';
import { useClientSize, useMethods } from '@lhb/hook';
import VideoList from '../../report/components/Modal/VideoList';
import { message, Modal } from 'antd';
import { immediatelyAnalysis } from '@/common/api/footprinting';
import { AnalysisStatusEnum } from '../../reviewdetail/ts-config';
import { refactorPermissions } from '@lhb/func';
import { bigdataBtn } from '@/common/utils/bigdata';
import V2Table from '@/common/components/Data/V2Table';

const defaultRender = { width: 130, render: (value: number | string) => valueFormat(value) };

// const operateList = [{ event: 'video:operate', name: '修改' }];

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
}) => {
  const scrollHeight = useClientSize().height - 260;
  const columns = [
    { title: '任务码', key: 'projectCode', width: 130, fixed: 'left' },
    { title: '需求品牌', key: 'demandBrandName', ...defaultRender },
    { title: '所属行业', key: 'industryName', ...defaultRender },
    {
      title: '需求城市',
      key: 'province',
      width: 130,
      render: (value: string, record) => renderProvince(value, record),
    },
    { title: '店铺类型', key: 'shopCategoryName', ...defaultRender },
    { title: '店铺位置', key: 'address', ...defaultRender },
    { title: '所属场地', key: 'placeName', ...defaultRender },
    { title: '场地类型', key: 'placeCategoryName', ...defaultRender },
    { title: '详细地址', key: 'placeAddress', ...defaultRender },
    { title: '踩点项目名称', key: 'name', ...defaultRender },
    { title: '踩点日期', key: 'checkDate', ...defaultRender },
    {
      title: '踩点时段',
      key: 'checkDate',
      width: 200,
      render: (value: any, record) => renderCheckDate(value, record),
    },
    { title: '踩点总时长(H)', key: 'checkDuration', ...defaultRender },
    { title: '踩点方式', key: 'checkWayName', ...defaultRender },
    { title: '踩点人员', key: 'checkerName', ...defaultRender },
    { title: '手机号码', key: 'checkerPhone', ...defaultRender },
    {
      title: '踩点状态',
      key: 'processName',
      render: (value: any, record) => {
        if (record.analysisStatus === AnalysisStatusEnum.NO_CREATE) {
          return record.processName;
        } else {
          return record.processName + ',' + record.analysisStatusName;
        }
      },
    },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 180,
      render: (value: any, record) => (
        <Operate
          showBtnCount={5}
          operateList={refactorPermissions(value || [])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];

  const [videoDetail, setVideoDetail] = useState<{ visible: boolean; id?: number }>({ visible: false });

  // 区域展示
  const renderProvince = (value: string, record: { province: string; city: string; district: string }) => {
    if (!value) return '-';
    return `${record.province || ''}${record.city && record.province !== record.city ? record.city : ''}${
      record.district || ''
    }`;
  };

  // 拼接时间和时间段展示
  const renderCheckDate = (value: string, record: { checkPeriod: any[] }) => {
    if (!value) return '-';
    const { checkPeriod } = record;
    if (Array.isArray(checkPeriod) && checkPeriod.length) {
      return checkPeriod.reduce((sum: any, cur: { start: string; end: string }) => {
        return `${sum} ${value} ${cur.start}-${cur.end}`;
      }, '') as string;
    }
    return value;
  };

  const { ...methods } = useMethods({
    handleProjectEdit(record: any) {
      bigdataBtn('e346b67b-e945-4ee1-88d9-0e32c0cef903', '踩点任务管理', '编辑', '点击了编辑踩点任务');
      setEditTask({
        visible: true,
        id: record.id,
        projectCode: record.projectCode,
        demandBrandName: record.demandBrandName,
        placeName: record.placeName,
      });
    },
    handleProjectDetail(record: any) {
      bigdataBtn('ccb9a80e-2947-4ce1-a56f-318da9eac370', '踩点任务管理', '查看', '查看了踩点任务');
      setTaskDetail({
        visible: true,
        id: record.id,
      });
    },
    handleProjectAllot(record: any) {
      bigdataBtn('b5719de0-3efb-4532-b45f-a80501a6b3a7', '踩点任务管理', '下发', '点击了下发踩点任务');
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
    handleCheckPointsSet(record: any) {
      setModalData({
        visible: true,
        id: record.id,
        filterAlreadySetVideos: false,
      });
    },
    handleProjectReport(record: any) {
      setVideoDetail({
        visible: true,
        id: record.id,
      });
    },
    handleProjectAnalysis(record: any) {
      // 立即分析
      const { id } = record;
      Modal.confirm({
        title: `立即分析`,
        content: `确认立即分析吗`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          immediatelyAnalysis({ id }).then(() => {
            onSearch(); // 更新列表
          });
        },
      });
    },
    handleCheckPointsView(record: any) {
      setModalData({
        visible: true,
        id: record.id,
        filterAlreadySetVideos: true,
      });
    },
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/329/interface/api/33876
    const { data, meta } = await post('/checkSpot/project/manage', params, true);
    return {
      dataSource: data || [],
      count: meta.total || 0,
    };
  };

  const onCloseModal = () => {
    setVideoDetail({ visible: false });
  };

  return (
    <>
      <V2Table
        rowKey='id'
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: rowSelection.map((item) => item.id),
          onChange: (selectedRowKeys, selectedRows) => selectionChange(selectedRows),
        }}
        refreshCurrent={refreshCurrent}
        filters={searchParams}
        scroll={{ x: 'max-content', y: scrollHeight }}
        defaultColumns={columns}
        onFetch={loadData}
      />
      <VideoList videoDetail={videoDetail} onCloseModal={onCloseModal} />
    </>
  );
};

export default TaskList;
