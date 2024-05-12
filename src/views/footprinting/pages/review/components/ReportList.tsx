import React, { useState } from 'react';
import { Image, Spin } from 'antd';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
import VideoList from './Modal/VideoList';

import { valueFormat } from '@/common/utils/ways';

import { post } from '@/common/request';
import { isNotEmpty, downloadFile, refactorPermissions } from '@lhb/func';
import { useClientSize, useMethods } from '@lhb/hook';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { AnalysisStatusEnum } from '../../reviewdetail/ts-config';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

const defaultRender = { width: 120, render: (value: number) => valueFormat(value) };

interface Props {
  filters: any;
}

const ReportList: React.FC<Props> = ({ filters }) => {
  const [videoDetail, setVideoDetail] = useState<{ visible: boolean; id?: number }>({ visible: false });
  const [picsInfo, setPicsInfo] = useState<{ visible: boolean; pics: Array<string> }>({ visible: false, pics: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const deviationRate = (value: number) => {
    return isNotEmpty(value) ? `${(value * 100).toFixed(2)}%` : '-';
  };

  const columns = [
    { title: '任务码', key: 'projectCode', width: 130, fixed: 'left' },
    { title: '踩点项目名称', key: 'name', ...defaultRender },
    { title: '踩点日期', key: 'checkDate', ...defaultRender },
    { title: '在营品牌', key: 'brandName', ...defaultRender },
    { title: '所在楼层', key: 'floor', ...defaultRender },
    { title: '左右品牌', key: 'aroundBrand', ...defaultRender },
    { title: '店铺面积', key: 'area', ...defaultRender },
    { title: '店铺租金', key: 'rent', ...defaultRender },
    { title: '踩点状态', key: 'processName', render: (value: any, record) => {
      if (record.analysisStatus === AnalysisStatusEnum.NO_CREATE) {
        return record.processName;
      } else {
        return record.processName + ',' + record.analysisStatusName;
      }
    }, },
    { title: '上传视频总数', key: 'videoNum', ...defaultRender, width: 130 },
    { title: '分析完成视频总数', key: 'analysisCompleteNum', ...defaultRender, width: 140 },
    { title: '分析总人数', key: 'flow', ...defaultRender },
    { title: '复核总人数', key: 'flowReview', ...defaultRender },
    { title: '偏差率', key: 'deviationRate', ...defaultRender, render: (value: number) => deviationRate(value) },
    {
      title: '操作',
      key: 'permissions',
      fixed: 'right',
      width: 200,
      render: (value: any, record) => (
        <Operate operateList={refactorPermissions(value)} onClick={(btn: any) => {
          methods[btn.func](record);
        }} />
      ),
    },
  ];
  const scrollHeight = useClientSize().height - 340;

  const { ...methods } = useMethods({
    handleReviewDetail(record: any) {
      setVideoDetail({
        visible: false,
        id: record.id,
      });
      dispatchNavigate(`/footprinting/reviewdetail?id=${record.id}`);
    },
    handleReportDownload(record: any) {
      setLoading(true);

      if (!record?.deliveryReportUrl) {
        V2Message.error('报告生成中，请耐心等待');
        setLoading(false);
        return;
      }
      downloadFile({
        name: '交付报告',
        downloadUrl: record.deliveryReportUrl,
        useBlob: true,
      });
      setLoading(false);

    },
    handleReviewShowPics(record: any) {
      setPicsInfo({
        visible: true,
        pics: record.pics || [],
      });
    },
    handleDetail(record: any) {
      dispatchNavigate(`/footprinting/reviewdetail?id=${record.id}`);
    },
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/329/interface/api/34250
    const { data, meta } = await post('/checkSpot/project/review', params);
    return {
      dataSource: data,
      count: meta.total,
    };
  };

  const onCloseModal = () => {
    setVideoDetail({ visible: false });
  };

  return (
    <>
      <Spin spinning={loading}>
        <Table
          filters={filters}
          rowKey='id'
          scroll={{ x: 'max-content', y: scrollHeight }}
          columns={columns}
          onFetch={loadData}
        />
        <VideoList videoDetail={videoDetail} onCloseModal={onCloseModal} />
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible: picsInfo.visible,
              onVisibleChange: (visible) => {
                setPicsInfo({ visible, pics: [] });
              }
            }}
          >
            {
              Array.isArray(picsInfo.pics) && picsInfo.pics.map((url: string, index: number) => <Image key={index} src={url}/>)
            }
          </Image.PreviewGroup>
        </div>
      </Spin>
    </>
  );
};

export default ReportList;
