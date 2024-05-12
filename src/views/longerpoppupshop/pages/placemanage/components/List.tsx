/*
 * @Author: xiangshangzhi
 * @Date: 2023-05-29 08:50:19
 * @FilePath: \console-pc\src\views\longerpoppupshop\pages\placemanage\components\List.tsx
 * @Description: 场地管理（备选址管理）
 */
import { FC, useState } from 'react';
import cs from 'classnames';

import V2Table from '@/common/components/Data/V2Table';

import { getColumns, generateOperates } from './listHelper';
import { useClientSize } from '@lhb/hook';
import { FilterParmas, Reports } from '../ts-config';
import SignModal from './SignModal';
/* 暂时先用场地筛选抽屉占位 */
import DetailDrawer from 'src/views/longerpoppupshop/pages/placescreen/components/detailDrawer';

import styles from '../entry.module.less';
import VideoViewer from '@/common/components/business/VideoViewer/VideoViewer';
import PicViewer from '@/common/components/business/PicViewer/PicViewer';
import { message } from 'antd';
interface IProps {
  loadData: Function;
  filterParams: FilterParmas;
  refresh: () => void;
}

const List: FC<IProps> = ({ loadData, filterParams, refresh }) => {
  // table 头部固定，动态获取剩余可视区的高度，超过这个区域头部固定中间内容滚动
  const scrollHeight = useClientSize().height - 340;

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [videoViewerInfo, setVideoViewerInfo] = useState<any>({ visible: false });
  const [picViewerInfo, setPicViewerInfo] = useState<any>({ visible: false });

  // 当前选中的列表项
  const [currentRecord, setCurrentRecord] = useState<Reports>({} as Reports);
  const { remove, change2Signed, change2Opened } = generateOperates(refresh);

  const openSignedModal = (record: Reports) => {
    setSignModalOpen(true);
    setCurrentRecord(record);
  };
  const openDetailDrawer = (record: Reports) => {
    setDetailDrawerOpen(true);
    setCurrentRecord(record);
  };

  /* 查看视频 */
  const viewVideo = (record: Reports) => {
    if (record && record.spotVideo) {
      setVideoViewerInfo({ visible: true, spotVideo: record.spotVideo });
    } else {
      message.info('暂无视频');
    }
  };
  /* 查看图片 */
  const viewPic = (record: Reports) => {
    if (record && record.spotPicture) {
      setPicViewerInfo({ visible: true, spotPicture: record.spotPicture });
    } else {
      message.info('暂无图片');
    }
  };

  const columns = getColumns({
    openDetailDrawer,
    viewVideo,
    viewPic,
    remove,
    openSignedModal,
    change2Opened,
  });

  return (
    <>
      <V2Table
        className={cs('mt-20', styles.tableWrap)}
        childrenColumnName='reports'
        defaultColumns={columns}
        onFetch={loadData}
        filters={filterParams}
        scroll={{ x: 'max-content', y: scrollHeight }}
        rowKey='id'
      />
      {signModalOpen && (
        <SignModal
          isOpen={signModalOpen}
          onCancel={() => setSignModalOpen(false)}
          onOk={(formValues) => {
            setSignModalOpen(false);
            change2Signed(currentRecord, formValues);
          }}
        />
      )}

      {detailDrawerOpen && <DetailDrawer record={currentRecord as any} isOpen={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)} />}
      <VideoViewer videoViewerInfo={videoViewerInfo} onCancel={() => setVideoViewerInfo({ visible: false })} />
      <PicViewer picViewerInfo={picViewerInfo} setVisible={(vis) => setPicViewerInfo({ visible: vis })} />
    </>
  );
};

export default List;
