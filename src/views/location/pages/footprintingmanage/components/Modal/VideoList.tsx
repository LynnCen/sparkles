import { FC } from 'react';
import { Modal, Typography } from 'antd';
import Table from '@/common/components/FilterTable';
import { valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request';
import dayjs from 'dayjs';
import { isNotEmpty } from '@lhb/func';
import { formatTimeStr } from '@/common/utils/ways';
const { Link } = Typography;

interface IProps {
  videoDetail: {
    visible: boolean;
    id?: number;
  };
  onCloseModal: () => void;
}

const defaultRender = { width: 100, render: (value: number) => valueFormat(value) };

const VideoList: FC<IProps> = ({ videoDetail, onCloseModal }) => {
  const deviationRate = (value: number) => {
    return isNotEmpty(value) ? `${(value * 100).toFixed(2)}%` : '-';
  };
  const columns = [
    {
      title: '时间段',
      key: 'startTime',
      width: 240,
      fixed: 'left',
      render: (value: string, record: any) => renderTimeRange(value, record),
    },
    {
      title: '视频URL',
      key: 'videoUrl',
      render: (value: string) =>
        (value && (
          <Link href={value} target='_blank'>
            {value}
          </Link>
        )) ||
        '-',
    },
    {
      title: '时长',
      key: 'duration',
      width: 130,
      render: (value: number) => formatTimeStr(value),
    },
    {
      title: '分析结果',
      key: 'result',
      children: [
        { title: '总人数', key: 'flow', ...defaultRender },
        { title: '男', key: 'flowMale', ...defaultRender },
        { title: '女', key: 'flowFemale', ...defaultRender },
      ],
    },
    {
      title: '复核结果',
      key: 'review',
      children: [
        { title: '总人数', key: 'flowReview', ...defaultRender },
        { title: '男', key: 'flowMaleReview', ...defaultRender },
        { title: '女', key: 'flowFemaleReview', ...defaultRender },
      ],
    },
    {
      title: '偏差率',
      key: 'deviationRate',
      fixed: 'right',
      ...defaultRender,
      render: (value: number) => deviationRate(value),
    },
  ];

  const renderTimeRange = (value: string, record: any) => {
    return `${value}-${dayjs(record.endTime).format('HH:mm:ss')}`;
  };

  const loadData = async (params: any) => {
    if (!params.id) return { dataSource: [] };
    // https://yapi.lanhanba.com/project/329/interface/api/34251
    const { data, meta } = await post('/checkSpot/review/pages', params, true);
    return {
      dataSource: data || [],
      count: meta?.total || 0,
    };
  };

  return (
    <>
      <Modal title='复核数据详情' open={videoDetail.visible} width={1400} footer={null} onCancel={onCloseModal}>
        <Table
          size='small'
          bordered
          rowKey='startTime'
          filters={{ id: videoDetail?.id }}
          scroll={{ x: 'max-content', y: 500 }}
          columns={columns}
          onFetch={loadData}
        />
      </Modal>
    </>
  );
};

export default VideoList;