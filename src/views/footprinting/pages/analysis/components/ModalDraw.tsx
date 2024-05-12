import { FC, useState, useRef, useEffect } from 'react';
import {
  Modal,
  Drawer,
  // message as msg,
  Pagination,
} from 'antd';
import { videoListData, savePoints } from '@/common/api/footprinting';
import VideoItem from './VideoItem';
import DrawImgItem from './DrawImgItem';
import styles from '../index.module.less';

/**
 *  注意！！
 *  ModalDraw同时被踩点任务管理和踩点分析设置引用
 */
const ModalDraw: FC<any> = ({ modalData, modalHandle, updateData }) => {
  const { visible, id: projectId, filterAlreadySetVideos } = modalData; // 视频列表的弹窗数据
  const drawRef = useRef(null);
  const [queryParams, setQueryParams] = useState<any>({
    // 视频列表的参数
    id: '',
    page: 1,
    size: 6,
    total: 0,
  });
  const [listData, setListData] = useState<Array<any>>([]); // 视频列表数据
  // canvas绘制多边形弹框
  const [canvasModal, setCanvasModal] = useState<any>({
    id: '', // 视频分析任务id(唯一)
    visible: false,
    imgSrc: '',
    width: '100%', // 弹窗默认宽
    height: '100%', // 弹窗默认高
  });

  useEffect(() => {
    // 监听列表传入的id
    projectId && setQueryParams((state) => ({ ...state, id: projectId, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    queryParams.id && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.id, queryParams.page]);

  const getList = async () => {
    const params = filterAlreadySetVideos ? { ...queryParams, hasCheckPoints: true } : queryParams;
    const { data, meta } = await videoListData(params);
    setListData(data);
    setQueryParams((state) => ({ ...state, total: meta?.total || 0 }));
  };

  const onDelete = () => {
    getList(); // 更新视频分页列表
    updateData(); // 更新页面table列表
  };

  const onUpdate = () => {
    getList(); // 更新视频分页列表
    updateData(); // 更新页面table列表
  };

  // 绘制多边形
  const submitDrawHandle = () => {
    (drawRef.current as any).submit().then(({ id, url, points }) => {
      const params = {
        id,
        projectId,
        imageUrl: url,
        checkPoints: points,
      };
      // 保存绘制的点位信息
      savePoints(params).then(() => {
        // setUpdateListStatus(true);
        closeDrawHandle(); // 关闭绘图弹窗
        getList(); // 更新视频分页列表
        updateData(); // 更新页面table列表
      });
    });
  };

  const closeDrawHandle = () => {
    // 关闭绘图弹窗
    setCanvasModal({
      id: '', // 视频分析任务id(唯一)
      visible: false,
      imgSrc: '',
      width: '100%', // 弹窗默认宽
      height: '100%', // 弹窗默认高
    });
  };

  const closeHandle = () => {
    setQueryParams((state) => ({ ...state, id: '' })); // 清空id，每次打开弹窗都获取列表
    modalHandle();
  };

  return (
    <>
      <Drawer
        title={filterAlreadySetVideos ? '设置规则详情' : '设置规则'}
        open={visible}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={'1000px'}
        onClose={closeHandle}
      >
        <div>
          {listData.map((videoItem) => (
            <div key={videoItem.id} className={styles.videoItem}>
              <VideoItem
                info={videoItem}
                setCanvasModal={setCanvasModal}
                loadData={updateData}
                onDelete={onDelete}
                onUpdate={onUpdate}
              ></VideoItem>
            </div>
          ))}
        </div>
        {/* 一页视频显示过多，视频加载卡顿 */}
        {queryParams.total > 0 && (
          <Pagination
            showQuickJumper
            pageSize={queryParams.size}
            showSizeChanger={false}
            showTotal={(total) => `共 ${total} 条`}
            total={queryParams.total}
            className='mt-20'
            onChange={(page) => setQueryParams((state) => ({ ...state, page }))}
          />
        )}
      </Drawer>

      {/* 视频截屏后绘图的弹窗 */}
      <Modal
        title='绘制多边形'
        open={canvasModal.visible}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={canvasModal.width + 180}
        bodyStyle={{
          height: `${canvasModal.height + 48}px`,
        }}
        onOk={submitDrawHandle}
        onCancel={() => closeDrawHandle()}
      >
        <DrawImgItem onRef={drawRef} modalData={canvasModal} />
      </Modal>
    </>
  );
};

export default ModalDraw;
