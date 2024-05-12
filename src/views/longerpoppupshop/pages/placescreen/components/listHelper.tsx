import { Button } from 'antd';
import { valueFormat } from '@/common/utils/ways';

import { PlaceList } from '../ts-config';

const commonRender = { width: 120, render: (value: number | string) => valueFormat(value) };

type Config = {
  setDetailDrawerOpen: (record: PlaceList) => void;
  openModal: (record: PlaceList) => void;
  viewVideo: (record: PlaceList) => void;
  viewPic: (record: PlaceList) => void;
};
export const getColumns = (config: Config) => {
  const { setDetailDrawerOpen, openModal, viewVideo, viewPic } = config;
  return [
    {
      title: '省市区',
      key: 'cityName',
      ...commonRender,
      render: (_, record) => (
        <div>
          {record.provinceName}/{record.cityName}/{record.districtName}
        </div>
      ),
      width: 170,
    },
    {
      title: '场地名称',
      key: 'placeName',
      width: 300,
      render: (value: string) => valueFormat(value),
    },
    {
      title: '等级',
      key: 'kaLevelName',
      width: 100,
      render: (value: string) => valueFormat(value),
    },
    { title: '场地类型', key: 'placeCategoryName', ...commonRender },
    { title: '节假日客流', key: 'flowWeekendSelectName', ...commonRender, width: '200px' },

    { title: '工作日客流', key: 'flowWeekdaySelectName', ...commonRender, width: '200px' },
    {
      title: '点位名称',
      key: 'spotName',
      width: 200,
      render: (value: string, record) => (
        <Button type='link' onClick={() => setDetailDrawerOpen(record)}>
          {value}
        </Button>
      ),
    },

    {
      title: '点位长(m)',
      key: 'spotLength',
      width: 200,
      render: (value: string) => valueFormat(value),
    },

    {
      title: '点位宽(m)',
      key: 'spotWidth',
      width: 200,
      render: (value: string) => valueFormat(value),
    },
    { title: '点位面积（m²）', key: 'spotSquare', ...commonRender, width: 160 },

    { title: '租金（元/月）', key: 'rentMonth', ...commonRender, width: 160 },
    {
      title: '点位视频',
      key: 'spotVideo',
      width: 80,
      render: (value: string[], record) =>
        record.spotVideo ? (
          <Button type='link' onClick={() => viewVideo(record)}>
            查看
          </Button>
        ) : (
          '-'
        ),
    },
    {
      title: '点位图片',
      key: 'spotPicture',
      width: 80,
      render: (value: string[], record) =>
        record.spotPicture ? (
          <Button type='link' onClick={() => viewPic(record)}>
            查看
          </Button>
        ) : (
          '-'
        ),
    },

    {
      title: '操作',
      key: 'opereate',
      render: (value: string, record) => (
        <Button type='link' onClick={() => openModal(record)}>
          加入备选地址
        </Button>
      ),
    },
  ];
};
