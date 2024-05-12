import { FC } from 'react';
import { Button, Modal } from 'antd';
import Table from '@/common/components/FilterTable';
// import IconFont from '@/common/components/IconFont';
// import CanvasVideo from './CanvasVideo';
import { downloadFile, valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request';
import dayjs from 'dayjs';
// const { Link } = Typography;

interface IProps {
  videoDetail: {
    visible: boolean;
    id?: number;
  };
  onCloseModal: () => void;
}

const defaultRender = { width: 130, render: (value: number) => valueFormat(value) };

export function formatTimeStr(secondTime: number) {
  let minuteTime = 0;// 分
  let hourTime = 0;// 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = Math.floor(secondTime / 60);
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = Math.floor(secondTime % 60);
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime >= 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = Math.floor(minuteTime / 60);
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = Math.floor(minuteTime % 60);
      return `${hourTime}小时${minuteTime}分${secondTime}秒`;
    }
    return `${minuteTime}分${secondTime ? `${secondTime}秒` : ''}`;
  }
  return `${secondTime}秒`;
}
const VideoList: FC<IProps> = ({ videoDetail, onCloseModal }) => {
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
        // (value && (
        //   <Button type='link' onClick={() => viewVideoHandle(record)}>{value}</Button>
        // )) ||
        // '-',
        (value && (
          // <Link href={value} target='_blank'>
          //   {value}
          // </Link>
          <div onClick={() => playVideoHandle(value)} className='c-006 pointer'>
            {value}
          </div>
        )) ||
        '-',

    },
    {
      title: '时长',
      key: 'duration',
      width: 130,
      render: (value: number) => formatTimeStr(value)
    },
    {
      title: '分析进度',
      key: 'statusName',
      width: 130
    },
    {
      title: '分析结果',
      key: 'result',
      fixed: 'right',
      children: [
        { title: '总人数', key: 'flow', ...defaultRender, fixed: 'right' },
        { title: '男', key: 'flowMale', ...defaultRender, fixed: 'right' },
        { title: '女', key: 'flowFemale', ...defaultRender, fixed: 'right' },
      ],
    },
  ];
  // 播放视频
  const playVideoHandle = (url: string) => {
    if (!url) return;
    window.open(url);
    // 部分子页面访问时上报归属的父级页面 https://confluence.lanhanba.com/pages/viewpage.action?pageId=67530354
    window.LHBbigdata.send({
      msg: {
        url: '/footprinting/report'
      }
    });
  };
  // const [canvasVideoData, setCanvasVideoData] = useState<any>({
  //   visible: false,
  //   url: '',
  //   points: []
  // });


  const renderTimeRange = (value: string, record: any) => {
    return `${value}-${dayjs(record.endTime).format('HH:mm:ss')}`;
  };

  const loadData = async (params: any) => {
    if (!params.id) return { dataSource: [] };
    // https://yapi.lanhanba.com/project/329/interface/api/33879
    const { data, meta } = await post('/checkSpot/report/pages', params);
    return {
      dataSource: data || [],
      count: meta?.total || 0,
    };
  };

  const exportVideoList = async () => {
    // https://yapi.lanhanba.com/project/329/interface/api/33895
    const url = await post('/checkSpot/report/export', { id: videoDetail.id }, true);
    downloadFile({
      name: '视频链接.xlsx',
      url: url,
    });
  };

  // const viewVideoHandle = (target: any) => {
  //   const { checkPoints, videoUrl } = target;
  //   // 是否已画过框
  //   if (Array.isArray(checkPoints) && checkPoints.length) {
  //     setCanvasVideoData({
  //       url: videoUrl,
  //       visible: true,
  //       points: checkPoints
  //     });
  //     return;
  //   }
  //   window.open(target.videoUrl); // 查看视频
  // };

  return (
    <>
      <Modal title='视频链接' zIndex={10001} open={videoDetail.visible} width={1200} footer={null} onCancel={onCloseModal}>
        <div className='mb-20 rt'>
          {/* <IconFont iconHref='icondownload' className='color-primary-operate' onClick={exportVideoList} /> */}
          <Button type='primary' onClick={exportVideoList}>
            导出
          </Button>
        </div>
        <Table
          size='small'
          bordered
          rowKey='id'
          filters={{ id: videoDetail?.id }}
          scroll={{ x: 'max-content', y: 500 }}
          columns={columns}
          onFetch={loadData}
        />
      </Modal>
      {/* <CanvasVideo
        modalData={canvasVideoData}
        modalHandle={() => setCanvasVideoData({ visible: false, url: '', points: [] })}/> */}
    </>
  );
};

export default VideoList;
