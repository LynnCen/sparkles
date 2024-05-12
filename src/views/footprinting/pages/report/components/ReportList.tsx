import React, { useState } from 'react';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';

import { valueFormat } from '@/common/utils/ways';
import VideoList from './Modal/VideoList';
import { post } from '@/common/request';
import { FiltersProps } from '../ts-config';
import { useClientSize, useMethods } from '@lhb/hook';
import { refactorPermissions } from '@lhb/func';

const defaultRender = { width: 120, render: (value: number) => valueFormat(value) };

// const operateList = [{ event: 'video:link', name: '视频链接' }];

interface Props {
  filters: FiltersProps;
}

const ReportList: React.FC<Props> = ({ filters }) => {
  const [videoDetail, setVideoDetail] = useState<{ visible: boolean; id?: number }>({ visible: false });
  const columns = [
    { title: '任务码', key: 'projectCode', width: 130, fixed: 'left' },
    { title: '需求品牌', key: 'demandBrandName', ...defaultRender },
    { title: '所属行业', key: 'industryName', ...defaultRender },
    { title: '需求城市', key: 'province', width: 130, render: (value: string, record) => renderProvince(value, record) },
    { title: '店铺类型', key: 'shopCategoryName', ...defaultRender },
    { title: '店铺位置', key: 'address', ...defaultRender },
    { title: '所属场地', key: 'placeName', ...defaultRender },
    { title: '场地类型', key: 'placeCategoryName', ...defaultRender },
    { title: '详细地址', key: 'placeAddress', ...defaultRender },
    { title: '踩点状态', key: 'processName', ...defaultRender },
    { title: '上传视频总数', key: 'videoNum', ...defaultRender, width: 130 },
    { title: '分析完成视频总数', key: 'analysisCompleteNum', ...defaultRender, width: 140 },
    { title: '踩点日期', key: 'checkDate', ...defaultRender },
    { title: '踩点方式', key: 'checkWayName', ...defaultRender },
    { title: '踩点人员', key: 'checkerName', ...defaultRender },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 100,
      render: (value: any, record) => (
        <Operate operateList={refactorPermissions(value || [])} onClick={(btn: any) => methods[btn.func](record)} />
      ),
    },
  ];
  const scrollHeight = useClientSize().height - 280;

  // 区域展示
  const renderProvince = (value: string, record: { province: string; city: string; district: string }) => {
    if (!value) return '-';
    return `${record.province || ''}${record.city && (record.province !== record.city) ? record.city : ''}${record.district || ''}`;
  };

  const { ...methods } = useMethods({
    handleProjectReport(record: any) {
      setVideoDetail({
        visible: true,
        id: record.id,
      });
    },
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/329/interface/api/33887
    const { data, meta } = await post('/checkSpot/project/report', params);
    return {
      dataSource: data,
      count: meta.total || 0,
    };
  };

  const onCloseModal = () => {
    setVideoDetail({ visible: false });
  };

  return (
    <>
      <Table
        filters={filters}
        rowKey='id'
        scroll={{ x: 'max-content', y: scrollHeight }}
        columns={columns}
        onFetch={loadData}
      />
      <VideoList videoDetail={videoDetail} onCloseModal={onCloseModal} />
    </>
  );
};

export default ReportList;
