import { Button, message } from 'antd';
import { approvalStatusClass, valueFormat } from '@/common/utils/ways';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { OperateButtonProps, Permission } from '@/common/components/Operate/ts-config';
import V2Operate from '@/common/components/Others/V2Operate';

import { post } from '@/common/request';
import { Reports } from '../ts-config';
import { refactorPermissions } from '@lhb/func';

const sharedOnCell = (record: any) => {
  if ((record?.reports || []).length > 0) {
    return { colSpan: 0 };
  }
  return {};
};

const commonRender = { width: 140, onCell: sharedOnCell, render: (value: number | string) => valueFormat(value) };

type Config = {
  viewVideo: (record: Reports) => void;
  viewPic: (record: Reports) => void;
  remove: (record: Reports) => void;
  openDetailDrawer: (record: Reports) => void;
  openSignedModal: (record: Reports) => void;
  change2Opened: (record: Reports) => void;
};
export const getColumns = (config: Config) => {
  const { viewVideo, viewPic, openDetailDrawer, remove, openSignedModal, change2Opened } = config;

  const renderStatus = (value, record) => {
    return <span className={approvalStatusClass(record.approvalStatus)}>{value}</span>;
  };

  const methods = {
    handleZmRelease: remove,
    handleZmSignContract: openSignedModal,
    handleZmOpen: change2Opened,
  };
  const columns = [
    {
      title: '省市区',
      key: 'cityName',
      width: 300,
      render: (_, record) =>
        (record?.reports || []).length <= 0 ? (
          <span>
            {record.provinceName}/{record.cityName}/{record.districtName}
          </span>
        ) : (
          <span> {record?.name}</span>
        ),
      onCell: (record) => ({
        colSpan: (record?.reports || []).length > 0 ? columns.length : 1,
      }),
    },
    {
      title: '当前状态',
      key: 'reportCycleName',
      ...commonRender,
      width: 100,
      render: (value, record) => renderStatus(value, record),
    },
    {
      title: '场地名称',
      key: 'placeName',
      ...commonRender,
      width: 300,
    },
    {
      title: '等级',
      key: 'kaLevelName',
      ...commonRender,
      width: 100,
      render: (value: string) => valueFormat(value),
    },
    { title: '场地类型', key: 'placeCategoryName', ...commonRender },
    { title: '节假日客流', key: 'flowWeekendSelectName', ...commonRender, width: '200px' },

    { title: '工作日客流', key: 'flowWeekdaySelectName', ...commonRender, width: '200px' },
    {
      title: '点位名称',
      key: 'spotName',
      ...commonRender,
      width: 300,
      render: (value: string, record: Reports) => (
        <Button type='link' onClick={() => openDetailDrawer(record)}>
          {value}
        </Button>
      ),
    },

    {
      title: '点位长(m)',
      key: 'spotLength',
      ...commonRender,
      width: 200,
      render: (value: string) => valueFormat(value),
    },

    {
      title: '点位宽(m)',
      key: 'spotWidth',
      ...commonRender,
      width: 200,
      render: (value: string) => valueFormat(value),
    },
    { title: '点位面积（m²）', key: 'spotSquare', ...commonRender, width: 160 },

    { title: '租金（元/月）', key: 'contractRent', ...commonRender, width: 160 },
    {
      title: '点位图片',
      key: 'spotPicture',
      ...commonRender,
      render: (value: string, record: Reports) =>
        record.spotPicture ? (
          <Button type='link' onClick={() => viewPic(record)}>
            查看
          </Button>
        ) : (
          '-'
        ),
    },
    {
      title: '点位视频',
      key: 'spotVideo',
      ...commonRender,
      render: (value: string, record: Reports) =>
        record.spotVideo ? (
          <Button type='link' onClick={() => viewVideo(record)}>
            查看
          </Button>
        ) : (
          '-'
        ),
    },
    {
      key: 'permissions',
      title: '操作',
      dragChecked: true,
      ...commonRender,
      render: (value: Permission[], record) => (
        <V2Operate
          operateList={refactorPermissions(value)}
          onClick={(btn: OperateButtonProps) => {
            // console.log('🚀 ~ file: listHelper.tsx:135 ~ <V2OperateoperateList={refactorPermissions ~ btn:', btn);

            methods[btn.func as string](record);
          }}
        />
      ),
    },
  ];

  return columns;
};

/* 移除 已签约 已开业 对应接口api */
const URL_MAP = {
  // https://yapi.lanhanba.com/project/353/interface/api/52506
  REMOVE: '/zm/alternate/release',
  // https://yapi.lanhanba.com/project/353/interface/api/52513
  CHANGE2SIGNED: '/zm/alternate/signContract',
  // https://yapi.lanhanba.com/project/353/interface/api/52520
  CHANGE2OPENED: '/zm/alternate/open',
};
export const generateOperates = (refresh: Function) => {
  /* 根据传入的type生成不同的操作函数 */
  const helper = (type: 'REMOVE' | 'CHANGE2SIGNED' | 'CHANGE2OPENED') => async (record: Reports, contractRent?: number) => {
    // message.info(type + ': ' + record.id);
    try {
      const url = URL_MAP[type];
      let params = { id: record.id } as any;
      /* 改为已签约需要传租金字段 */
      if (type === 'CHANGE2SIGNED') {
        params = {
          ...params,
          contractRent,
        };
      }
      const res = await post(url, params);
      if (res) {
        message.success('操作成功');
        refresh();
      } else {
        message.error('删除失败');
      }
    } catch (e) {
      message.error('网络错误');
    }
  };
  const _remove = helper('REMOVE');
  const _change2Signed = helper('CHANGE2SIGNED');
  const _change2Opened = helper('CHANGE2OPENED');

  const remove = (record: Reports) => {
    ConfirmModal({
      onSure: (modal) => {
        modal.destroy();
        _remove(record);
      },
      title: '确认移除该备选址？',
      content: '移除后该场地会退回至场地筛选列表中',
    });
  };

  /* 已开业 */
  const change2Opened = (record: Reports) => {
    ConfirmModal({
      onSure: (modal) => {
        modal.destroy();
        _change2Opened(record);
      },
      content: '该备选址确认已开业？',
    });
  };
  /* 已签合同 */
  const change2Signed = (record: Reports, formValues: any) => {
    _change2Signed(record, formValues.contractRent);
  };
  return {
    remove,
    change2Signed,
    change2Opened,
  };
};
