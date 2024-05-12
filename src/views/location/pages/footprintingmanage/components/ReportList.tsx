import React, { ReactElement } from 'react';
import { refactorPermissions, urlParams } from '@lhb/func';
import {
  FileUnknownFilled,
  FilePptFilled,
  FileExcelFilled,
  FilePdfFilled
} from '@ant-design/icons';
// import { Image, Spin } from 'antd';
import Table from '@/common/components/FilterTable';
import Operate from '@/common/components/Operate';
// import VideoList from './Modal/VideoList';

import { valueFormat } from '@/common/utils/ways';

import { post } from '@/common/request';
// import { downloadFile } from '@lhb/func';
import { useMethods } from '@lhb/hook';
// import { dispatchNavigate } from '@/common/document-event/dispatch';
import { AnalysisStatusEnum } from '../ts-config';

const defaultRender = { width: 120, render: (value: number) => valueFormat(value) };

interface Props {
  filters: any;
  setVisible: Function;
  setTargetInfo: Function;
}

const ReportList: React.FC<Props> = ({
  filters,
  setVisible,
  setTargetInfo
}) => {
  // const [videoDetail, setVideoDetail] = useState<{ visible: boolean; id?: number }>({ visible: false });
  // const [picsInfo, setPicsInfo] = useState<{ visible: boolean; pics: Array<string> }>({ visible: false, pics: [] });
  // const [loading, setLoading] = useState<boolean>(false);
  // const deviationRate = (value: number) => {
  //   return isNotEmpty(value) ? `${(value * 100).toFixed(2)}%` : '-';
  // };

  const columns = [
    { title: '任务码', key: 'projectCode', width: 130, fixed: 'left' },
    { title: '踩点项目名称', key: 'name', ...defaultRender },
    { title: '交付报告', key: 'deliveryReportUrl', width: 120, render: (value) => renderFileType(value) },
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
    // { title: '复核总人数', key: 'flowReview', ...defaultRender },
    // { title: '偏差率', key: 'deviationRate', ...defaultRender, render: (value: number) => deviationRate(value) },
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
  // const scrollHeight = useClientSize().height - 340;

  const { ...methods } = useMethods({
    // handleReviewDetail(record: any) {
    //   setVideoDetail({
    //     visible: false,
    //     id: record.id,
    //   });
    //   dispatchNavigate(`/footprinting/reviewdetail?id=${record.id}`);
    // },
    // handleReviewPPT(record: any) {
    //   setLoading(true);
    //   //   导出分析报告
    //   //   https://yapi.lanhanba.com/project/329/interface/api/39990
    //   post('/checkSpot/review/exportUrl', { id: record.id })
    //     .then(({ url }) => {
    //       downloadFile({ url });
    //     }).finally(() => { setLoading(false); });
    // },
    // handleReviewShowPics(record: any) {
    //   setPicsInfo({
    //     visible: true,
    //     pics: record.pics || [],
    //   });
    // },
    // handleDetail(record: any) {
    //   dispatchNavigate(`/footprinting/reviewdetail?id=${record.id}`);
    // },
    handleImportDeliveryReport(row: any) {
      const { id, projectCode } = row;
      setVisible(true);
      setTargetInfo({ id, projectCode });
    }
  });

  const loadData = async (params: any) => {
    // https://yapi.lanhanba.com/project/289/interface/api/40193
    const { objectList, totalNum } = await post('/checkSpot/project/pages', params, {
      proxyApi: '/blaster',
      needHint: true
    });
    return {
      dataSource: objectList,
      count: totalNum,
    };
  };

  const renderFileType = (fileUrl: string) => {
    if (fileUrl) {
      const fileName = urlParams(fileUrl)?.attname || '';
      if (!fileName) return '-';
      const splitResult = fileName.split('.');
      const len = splitResult.length;
      const type = splitResult[len - 1].toLowerCase();
      let icon: ReactElement = <FileUnknownFilled />;
      switch (type) {
        case 'xlsx':
          icon = <FileExcelFilled style={{ color: '#067045' }}/>;
          break;
        case 'xls':
          icon = <FileExcelFilled style={{ color: '#067045' }}/>;
          break;
        case 'ppt':
          icon = <FilePptFilled style={{ color: '#eb543c' }}/>;
          break;
        case 'pptx':
          icon = <FilePptFilled style={{ color: '#eb543c' }}/>;
          break;
        case 'pdf':
          icon = <FilePdfFilled style={{ color: '#c12f40' }}/>;
          break;
      }
      return (<>
        {icon} 已上传
      </>);
    }
    return '-';
  };

  // const onCloseModal = () => {
  //   setVideoDetail({ visible: false });
  // };

  return (
    <>
      {/* <Spin spinning={loading}> */}
      <Table
        filters={filters}
        rowKey='id'
        // scroll={{ x: 'max-content', y: scrollHeight }}
        columns={columns}
        onFetch={loadData}
      />
      {/* <VideoList videoDetail={videoDetail} onCloseModal={onCloseModal} /> */}
      {/* <div style={{ display: 'none' }}>
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
        </div> */}
      {/* </Spin> */}
    </>
  );
};

export default ReportList;
