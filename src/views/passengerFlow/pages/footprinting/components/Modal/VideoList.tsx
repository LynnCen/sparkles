import { FC, useEffect, useMemo, useState } from 'react';
import { Modal, Popover, Table, Typography } from 'antd';
import { useMethods } from '@lhb/hook';

// import CanvasVideo from './CanvasVideo';
import styles from './index.module.less';
import { downloadFile, valueFormat } from '@/common/utils/ways';
import { post } from '@/common/request';
import V2Operate from '@/common/components/Others/V2Operate';
import ImportVideoList, { treeData, treeDataProps } from './ImportVideoList';
import { deepCopy, recursionEach, refactorPermissions } from '@lhb/func';
import VideoStatusIcon from './VideoStatusIcon';
import { V2Confirm } from '@/common/components/Others/V2Confirm';

const { Link } = Typography;
const { Column, ColumnGroup } = Table;

// const treeColumns: any[] = [
//   { 'title': '时间段', 'key': 'startTime', 'showColumn': true, 'children': [] }, { 'title': '过店客流', 'key': 'flow', 'showColumn': true, 'children': [{ 'title': '过店总数', 'key': 'flowAll', 'showColumn': false }, { 'title': '女性', 'key': 'flowFemale', 'showColumn': true, 'children': [{ 'title': '儿童', 'key': 'flowFemaleChildren', 'showColumn': true }, { 'title': '青壮年', 'key': 'flowFemaleYouth', 'showColumn': true }, { 'title': '老人', 'key': 'flowFemaleOle', 'showColumn': true }, { 'title': '女性总数', 'key': 'flowFemaleAll', 'showColumn': true }] }, { 'title': '男性', 'key': 'flowMale', 'showColumn': false, 'children': [{ 'title': '儿童', 'key': 'flowMaleChildren', 'showColumn': false }, { 'title': '青壮年', 'key': 'flowMaleYouth', 'showColumn': false }, { 'title': '老人', 'key': 'flowMaleOle', 'showColumn': false }, { 'title': '男性总数', 'key': 'flowMaleAll', 'showColumn': false }] }] }, { 'title': '进店客流', 'key': 'passenger', 'showColumn': true, 'children': [{ 'title': '进店总数', 'key': 'passengerAll', 'showColumn': true }, { 'title': '女性', 'key': 'passengerFemale', 'showColumn': true, 'children': [{ 'title': '儿童', 'key': 'passengerFemaleChildren', 'showColumn': false }, { 'title': '青壮年', 'key': 'passengerFemaleYouth', 'showColumn': false }, { 'title': '老人', 'key': 'passengerFemaleOle', 'showColumn': false }, { 'title': '女性总数', 'key': 'passengerFemaleAll', 'showColumn': true }] }, { 'title': '男性', 'key': 'passengerMale', 'showColumn': true, 'children': [{ 'title': '儿童', 'key': 'passengerMaleChildren', 'showColumn': false }, { 'title': '青壮年', 'key': 'passengerMaleYouth', 'showColumn': false }, { 'title': '老人', 'key': 'passengerMaleOle', 'showColumn': false }, { 'title': '男性总数', 'key': 'passengerMaleAll', 'showColumn': true }] }] }, { 'title': '进店率', 'key': 'indoorRate', 'showColumn': true, 'children': [] }, { 'title': '提袋客流', 'key': 'shoppingRate', 'showColumn': true, 'children': [] }, { 'title': '提袋率', 'key': 'shoppingAll', 'showColumn': true, 'children': [] }
// ];


// table 默认展示的列，全展示
const _treeData: any = recursionEach(deepCopy(treeData), 'children', (item: treeDataProps) => {
  item.showColumn = true;
});

// 默认展示列
const defaultColumns: treeDataProps[] = [
  {
    title: '时间段',
    key: 'startTime',
    showColumn: true,
    children: [],
    width: 240,
  },
  {
    title: '视频URL',
    key: 'videos',
    showColumn: true,
    children: [],
    width: 80,
  },
  {
    title: '是否有效视频',
    key: 'statusName',
    showColumn: true,
    children: [],
    width: 100,
  },
];



interface IProps {
  videoDetail: {
    visible: boolean;
    id?: number;
  };
  onCloseModal: () => void;
}


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
  const [importModel, setImportModel] = useState<boolean>(false);
  // const [treeColumns, setTreeColumns] = useState<any[]>([]);

  const [operateList, setOperateList] = useState<any[]>([]);
  const realOperateList = useMemo(() => {
    return operateList.concat([
      {
        name: '导入',
        event: 'importVideoList',
        type: 'primary',
        func: 'handleImportVideoList',
      },
      {
        name: '导出', // 必填
        event: 'exportVideoList', // 必填
        type: 'primary', //  非必填，默认为link
        func: 'handleExportVideoList',
      },
    ]);
  }, [operateList]);

  const [data, setData] = useState<any>({
    flowList: [],
    treeColumns: [],
    permissions: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.permissions?.length && videoDetail.visible) {
      const _operateList = refactorPermissions(data.permissions).map((item) => {
        item.type = 'primary';
        return item;
      });
      setOperateList(_operateList);
    } else {
      setOperateList([]);
    }
  }, [data.permissions, videoDetail.visible]);

  // const [canvasVideoData, setCanvasVideoData] = useState<any>({
  //   visible: false,
  //   url: '',
  //   points: []
  // });

  const renderVideoContent = (status: number, errorMsg: string) => {
    let text = '';
    switch (status) {
      case 0:
        text = '视频未进行分析，请尽快分析';
        break;
      case 1:
        text = '视频分析等待中，请稍等';
        break;
      case 2:
        text = '视频分析进行中，请稍等';
        break;
      case 3:
        text = `失败原因：${errorMsg}`;
        break;
      case 4:
        text = `视频已分析完成`;
        break;

      default:
        text = '-';
        break;
    }

    return text;
  };

  const renderTimeRange = (value: string, record: any) => {
    return `${record.date} ${value}-${record.endTime}`;
  };

  const loadData = async () => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/329/interface/api/56615
    const { flowList = [], fields = [], permissions = [] } = await post('/checkSpot/project/flow', { id: videoDetail.id }, {
      proxyApi: '/terra-api',
      needHint: true
    });
    const treeColumns: treeDataProps[] = fields?.length ? fields : _treeData;
    const _treeColumns = [...defaultColumns, ...treeColumns];

    setData({
      treeColumns: _treeColumns,
      flowList: flowList || [],
      permissions
    });

    setLoading(false);

  };


  const methods = useMethods({
    async handleExportVideoList() {
      // https://yapi.lanhanba.com/project/329/interface/api/33895
      const url = await post('/checkSpot/report/export', { id: videoDetail.id }, {
        proxyApi: '/terra-api',
        needHint: true
      });
      downloadFile({
        name: '视频链接.xlsx',
        url: url,
      });
    },
    handleImportVideoList() {
      setImportModel(true);
    },
    closeModal() {
      setImportModel(false);
    },
    handleReFetchObResult() {
      V2Confirm({
        onSure: (modal: any) => {
          // https://yapi.lanhanba.com/project/329/interface/api/68256
          post('/checkSpot/project/reFetchAnalysisResult', { id: videoDetail.id }, {
            proxyApi: '/terra-api',
            needHint: true
          }).then(() => {
            loadData();
          }).finally(() => modal.destroy());
        },
        content: '确定将分析失败视频前往OB获取数据吗？',
        okText: '确定'
      });
    },
  });

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

  // 表格列渲染
  const renderColumn = (value: any, record: any, key: string) => {
    switch (key) {
      case 'startTime':
        return renderTimeRange(value, record);
      case 'videos':
        if (value && value.length) {
          return value.map((item: any, index: number) => {
            return (
              <Popover key={index} placement='top' title={item.statusName} content={<>
                <div>{renderVideoContent(item.status, item.error)}</div>
                <div>ob_id: {item.obId || '-'}</div>
              </>}>
                <div><Link href={item.url} target='_blank'><VideoStatusIcon status={item.status} /> 视频{index + 1}</Link></div>
              </Popover>
            );
          });
        } else {
          return '-';
        }

      default:
        return valueFormat(value);
    }
  };

  // 根据配置的树结果渲染表格
  const renderColumns = (treeData: any[]) => {
    return treeData.map((item) => {
      if (item.showColumn) {
        if (item.children && item.children.length) {
          return (
            <ColumnGroup title={item.title} key={item.key}>
              {renderColumns(item.children)}
            </ColumnGroup>
          );
        } else {
          let title = item.title;
          switch (item.key) {
            case 'indoorRate':
              title = item.title + '(%)';
              break;
            case 'shoppingRate':
              title = item.title + '(%)';
              break;
            default:
              break;
          }
          return item.showColumn
            ? <Column
              title={title}
              key={item.key}
              dataIndex={item.key}
              fixed={item.key === 'startTime' ? 'left' : false}
              width={item.width}
              render={(value: string, record: any) => renderColumn(value, record, item.key)}
            />
            : <></>;
        }
      } else {
        return <></>;
      }
    });
  };

  useEffect(() => {
    if (videoDetail.visible) {
      loadData();
    }
  }, [videoDetail.visible]);

  return (
    <>
      <Modal
        title='分析结果列表'
        open={videoDetail.visible}
        width={1200}
        footer={null}
        className={styles.videoModal}
        onCancel={onCloseModal}>
        <div className={styles.operate}>
          <V2Operate
            showBtnCount={5}
            operateList={realOperateList}
            onClick={(btns: { func: string | number }) => methods[btns.func]()}
          />
        </div>
        {/* TODO: 这个 table 有时间可以重构使用 @/views/passengerFlow/pages/reviewdetail/components/VideoList */}
        <Table
          size='small'
          bordered
          scroll={{ x: 'max-content', y: 460 }}
          pagination={false}
          loading={loading}
          rowKey={'startTime'}
          dataSource={data.flowList}
        >
          {renderColumns(data.treeColumns)}
        </Table>
      </Modal>
      {/* <CanvasVideo
        modalData={canvasVideoData}
        modalHandle={() => setCanvasVideoData({ visible: false, url: '', points: [] })}/> */}
      <ImportVideoList
        visible={importModel}
        onCloseModal={methods.closeModal}
        targetInfo={videoDetail}
        refreshList={loadData}
      />
    </>
  );
};

export default VideoList;
