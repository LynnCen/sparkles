import { FC, useState } from 'react';
import { message } from 'antd';

import V2Table from '@/common/components/Data/V2Table';

import { useClientSize } from '@lhb/hook';
import DetailDrawer from '../components/detailDrawer';
import { post } from '@/common/request';
import SelectModal from './Modal';
import { getColumns } from './listHelper';
import { FilterParmas, PlaceList, Task } from '../ts-config';
import VideoViewer from '@/common/components/business/VideoViewer/VideoViewer';
import PicViewer from '@/common/components/business/PicViewer/PicViewer';

// import styles from '../entry.module.less';
interface IProps {
  loadData: Function;
  filterParams: FilterParmas;
  refresh: () => void;
}

const List: FC<IProps> = ({ loadData, filterParams, refresh }) => {
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  // 当前选中的列表项
  const [currentRecord, setCurrentRecord] = useState<PlaceList>({} as PlaceList);
  /* 当前租户下的拓店任务 */
  const [task, setTask] = useState<Task[]>([]);

  const [videoViewerInfo, setVideoViewerInfo] = useState<any>({ visible: false });
  const [picViewerInfo, setPicViewerInfo] = useState<any>({ visible: false });

  /* 查看视频 */
  const viewVideo = (record) => {
    if (record && record.spotVideo) {
      setVideoViewerInfo({ visible: true, spotVideo: record.spotVideo });
    } else {
      message.info('暂无视频');
    }
  };
  /* 查看图片 */
  const viewPic = (record) => {
    if (record && record.spotPicture) {
      setPicViewerInfo({ visible: true, spotPicture: record.spotPicture });
    } else {
      message.info('暂无图片');
    }
  };

  /* 打开加入备选弹窗 */
  const openModal = async (record: PlaceList) => {
    // https://yapi.lanhanba.com/project/353/interface/api/52485
    const response = await post('/zm/task/pageAssignee');
    const result = response?.data;
    setTask(result);
    setCurrentRecord(record);
    /* 需要判断当前租户下有几个拓店任务 */
    const totalTask = result?.length;

    if (totalTask > 1) {
      setSelectModalOpen(true);
    } else {
      const params = {
        id: record.id,
        taskId: result?.[0]?.id,
      };
      onAddAdress(params);
    }
  };

  /* 加入备选地址 */
  const onAddAdress = async (params) => {
    // https://yapi.lanhanba.com/project/353/interface/api/52534
    const url = '/zm/chancePoint/associate';
    try {
      const result: any = await post(url, params, true);
      message.success('操作成功！');
      if (result) {
        setSelectModalOpen(false);
        refresh();
      }
    } catch (e) {
      setSelectModalOpen(false);
    }
  };
  const columns = getColumns({
    setDetailDrawerOpen: (record) => {
      setDetailDrawerOpen(true);
      setCurrentRecord(record);
    },
    openModal,
    viewVideo,
    viewPic,
  });

  return (
    <>
      <V2Table
        className='mt-20'
        defaultColumns={columns}
        onFetch={loadData}
        filters={filterParams}
        scroll={{ x: 'max-content', y: scrollHeight }}
        rowKey='id'
      />
      {/* 备选地址弹框 */}
      {selectModalOpen && (
        <SelectModal
          isOpen={selectModalOpen}
          tasks={task}
          currentRecord={currentRecord}
          onCancel={() => setSelectModalOpen(false)}
          onOk={onAddAdress}
        />
      )}

      {detailDrawerOpen && (
        <DetailDrawer record={currentRecord} isOpen={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)} origin='PlaceScreen' />
      )}
      <VideoViewer videoViewerInfo={videoViewerInfo} onCancel={() => setVideoViewerInfo({ visible: false })} />
      <PicViewer picViewerInfo={picViewerInfo} setVisible={(vis) => setPicViewerInfo({ visible: vis })} />
    </>
  );
};

export default List;
