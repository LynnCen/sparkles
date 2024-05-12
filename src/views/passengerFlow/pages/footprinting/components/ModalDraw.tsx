import { FC, useState, useRef, useEffect } from 'react';
import {
  Button,
  Row,
  Col,
  Radio,
  RadioChangeEvent,
  Divider,
  Checkbox,
  Pagination,
} from 'antd';
import { videoListData, savePoints, passengerFlowBatchAnalysis } from '@/common/api/footprinting';
import VideoItem from './VideoItem';
import DrawImgItem from './DrawImgItem';
import { CanvasDrawTypeEnum } from '../ts-config';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2Title from '@/common/components/Feedback/V2Title';
import LazyLoad from '@/common/components/LazyLoad';
import V2Container from '@/common/components/Data/V2Container';

import styles from './entry.module.less';
import V2Operate from '@/common/components/Others/V2Operate';
import { floorKeep, getKeysFromObjectArray, refactorPermissions } from '@lhb/func';
import { useMethods } from '@lhb/hook';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import ApplyOtherModal, { ApplyOtherModalDataProps } from './Modal/ApplyOtherModal';
import Modal from '@/common/components/Modal/Modal';
import BatchAnalysisModal, { BatchAnalysisModalDataProps } from './Modal/BatchAnalysisModal';


const ModalDraw: FC<any> = ({ modalData, modalHandle, updateData }) => {
  const { visible, id: projectId } = modalData; // 视频列表的弹窗数据
  const drawRef = useRef<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [queryParams, setQueryParams] = useState<any>({
    // 视频列表的参数
    id: '',
    page: 1,
    size: 20, // 不使用分页，目前最多应该有四五十条视频
    total: 0,
    drawType: 1
  });
  const [listData, setListData] = useState<any>({
    list: [],
    nonCheckPointsCount: 0, // 未绘制画框数量
    hasCheckPointsCount: 0, // 已绘制画框数量
  }); // 视频列表数据
  // canvas绘制多边形弹框
  const [canvasModal, setCanvasModal] = useState<any>({
    id: '', // 视频分析任务id(唯一)
    visible: false,
    imgSrc: '',
    width: '100%', // 弹窗默认宽
    height: '100%', // 弹窗默认高
    pointData: null, // 默认绘制数据
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editImgId, setEditImgId] = useState(0); // 当前修改画框范围的Id
  const [checkedList, setCheckedList] = useState<any[]>([]); // 勾选列表
  const [indeterminate, setIndeterminate] = useState<boolean>(false); // 全选半勾选状态
  const [checkAll, setCheckAll] = useState<boolean>(false); // 是否全选
  const [applyOtherModalData, setApplyOtherModalData] = useState<ApplyOtherModalDataProps>({
    visible: false,
    projectId: '',
    currentId: '',
    outdoorPoints: [],
    indoorPoints: [],
  }); // 保存成功，应用到全部弹窗
  const [batchAnalysisModal, setBatchAnalysisModal] = useState<BatchAnalysisModalDataProps>({
    visible: false,
    contentText: ''
  });


  const options = [
    {
      value: 1,
      label: `全部`,
    },
    {
      value: 2,
      label: `待绘制(${listData.nonCheckPointsCount})`,
    },
    {
      value: 3,
      label: `已绘制(${listData.hasCheckPointsCount})`,
    },
  ];


  useEffect(() => {
    // 监听列表传入的id
    projectId && setQueryParams((state) => ({ ...state, id: projectId, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    queryParams.id && getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.id, queryParams.page, queryParams.hasCheckPoints, queryParams.drawType, queryParams.size]);

  const getList = async () => {
    const params = queryParams;
    const { data, meta } = await videoListData(params);
    setListData({
      ...listData,
      list: data,
      nonCheckPointsCount: meta.data.nonCheckPointsCount || 0,
      hasCheckPointsCount: meta.data.hasCheckPointsCount || 0,
      permissions: meta.data.permissions || [],
    });
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
    (drawRef.current as any).submit().then(({ id, url, pointData }) => {
      const params = {
        id,
        projectId,
        imageUrl: url,
        outdoorPoints: pointData[CanvasDrawTypeEnum.CROSS],
        indoorPoints: pointData[CanvasDrawTypeEnum.ENTER],
      };
      setConfirmLoading(true);
      // 保存绘制的点位信息
      savePoints(params).then(() => {
        // setUpdateListStatus(true);
        closeDrawHandle(); // 关闭绘图弹窗
        setEditImgId(id);
        getList(); // 更新视频分页列表
        updateData(); // 更新页面table列表
        setApplyOtherModalData({
          ...applyOtherModalData,
          ...params,
          visible: true,
          currentId: id,
        });
      }).finally(() => {
        setConfirmLoading(false);
      });
      return;
    }).catch(() => {
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
      pointData: null, // 默认绘制数据
    });
  };

  const methods = useMethods({
    /** 切换 tabs */
    changeDrawType({ target: { value } }: RadioChangeEvent) {
      let hasCheckPoints:boolean|null = null;
      switch (value) {
        case 1:
          hasCheckPoints = null;
          break;
        case 2:
          hasCheckPoints = false;
          break;
        case 3:
          hasCheckPoints = true;
          break;

        default:
          hasCheckPoints = null;
          break;
      }
      setQueryParams({
        ...queryParams,
        drawType: value,
        hasCheckPoints
      });
      // 清空checkbox
      methods.resetCheckbox();
    },
    resetCheckbox() {
      // 清空checkbox
      setCheckAll(false);
      setCheckedList([]);
      setIndeterminate(false);
    },
    /** 多选框 change */
    checkChange(checkedValues: any[]) {
      setCheckedList(checkedValues);
      setIndeterminate(!!checkedValues.length && checkedValues.length < listData.list.length);
      setCheckAll(checkedValues.length === listData.list.length);
    },
    /** 全选框 change */
    onCheckAllChange(e: CheckboxChangeEvent) {
      setCheckedList(e.target.checked ? listData.list : []);
      setIndeterminate(false);
      setCheckAll(e.target.checked);
    },
    handleBatchAnalysis() {
      if (!checkedList.length) {
        V2Message.error('请选择需要分析的图片');
        return;
      };
      // 已画框数据
      const analyzableList:any[] = checkedList.filter(item => !!item.hasCheckPoints);
      if (!analyzableList.length) {
        V2Message.info('未画框不允许提交分析哦！');
        return;
      };
      // 未画框数量
      const surplus = floorKeep(checkedList.length, analyzableList.length, 1, 0);
      const request = new Promise<void>((resolve, reject) => {
        const params = {
          projectId,
          videoIds: getKeysFromObjectArray(analyzableList, 'id'),
        };
        passengerFlowBatchAnalysis(params).then(() => {
          onUpdate();
          resolve();
        }, () => {
          V2Message.error('操作失败，请重试！');
          reject();
        });
      });
      if (!surplus) {
        request.then(() => {
          V2Message.success('已提交分析');
          // 清空checkbox
          methods.resetCheckbox();
        });
      } else {
        request.then(() => {
          const content = `已提交分析${analyzableList.length}个，剩余${surplus}个未画分析区域请完善后进行分析`;
          setBatchAnalysisModal({
            visible: true,
            contentText: content
          });
        });
      }
    },
    onPaginationChange(page: number, pageSize: number) {
      setCheckedList([]);
      setIndeterminate(false);
      setCheckAll(false);
      setQueryParams((state) => ({ ...state, page, size: pageSize }));
    },
  });

  const closeHandle = () => {
    methods.resetCheckbox();
    setQueryParams((state) => ({ ...state, id: '', drawType: 1, hasCheckPoints: null, size: 20 })); // 清空id，每次打开弹窗都获取列表
    modalHandle();
  };


  return (
    <>
      <V2Drawer
        open={visible}
        destroyOnClose={true}
        keyboard={false}
        onClose={closeHandle}
        className={styles.drawContainer}
      >
        <V2Container
          style={{ height: 'calc(100vh - 64px)', width: '100%' }}

          emitMainHeight={(h) => setMainHeight(h)}
          extraContent={{
            top: <>
              <V2Title text={ '设置规则'} />
              <Divider />
              <div className={styles.filterBox}>
                <Radio.Group options={options} onChange={methods.changeDrawType} value={queryParams.drawType} optionType='button' />
                <div className={styles.filterBoxRight}>
                  <Checkbox indeterminate={indeterminate} onChange={methods.onCheckAllChange} checked={checkAll}>全选</Checkbox>
                  <V2Operate
                    showBtnCount={4}
                    operateList={refactorPermissions(listData.permissions, [], (item) => {
                      if (item.event === 'checkSpot:batchAnalysis') {
                        item.type = 'primary';
                      }
                      return item;
                    })}
                    onClick={(btns: { func: string | number }) => methods[btns.func]()}
                  />
                </div>
              </div>
            </>,
            bottom: <>
              {/* 一页视频显示过多，视频加载卡顿 */}
              {queryParams.total > 0 && (
                <Pagination
                  showQuickJumper
                  pageSize={queryParams.size}
                  showSizeChanger={true}
                  showTotal={(total) => `共 ${total} 条`}
                  total={queryParams.total}
                  className='mt-20'
                  onChange={(page, pageSize) => methods.onPaginationChange(page, pageSize)}
                />
              )}
            </>
          }}
        >
          <Checkbox.Group onChange={methods.checkChange} value={checkedList} style={{ height: mainHeight, overflowY: 'auto' }}>
            <Row gutter={[24, 24]} className='mt-20'>
              {listData.list.map((videoItem) => (
                <Col span={12} key={videoItem.id}>
                  <LazyLoad>
                    {/* <Checkbox value={videoItem}> */}
                    <VideoItem
                      info={videoItem}
                      setCanvasModal={setCanvasModal}
                      loadData={updateData}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                      editImgId={editImgId}
                    />
                    {/* </Checkbox> */}
                  </LazyLoad>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </V2Container>
        <ApplyOtherModal
          modalData={applyOtherModalData}
          setModalData={setApplyOtherModalData}
          onRefresh={onUpdate}
        />
        <BatchAnalysisModal
          modalData={batchAnalysisModal}
          setModalData={setBatchAnalysisModal}
          onOk={methods.resetCheckbox}
        />
      </V2Drawer>

      {/* 视频截屏后绘图的弹窗 */}
      <Modal
        title='绘制多边形'
        open={canvasModal.visible}
        destroyOnClose={true}
        maskClosable={false}
        keyboard={false}
        width={canvasModal.modalWidth}
        bodyStyle={{
          height: `${canvasModal.modalHeight}px`,
        }}
        centered
        onCancel={() => closeDrawHandle()}
        footer={<>
          <Button onClick={() => drawRef.current?.strokeDoneDraw()}>结束绘制</Button>
          <Button onClick={() => drawRef.current?.clear()}>重新绘制</Button>
          <Button type='primary' loading={confirmLoading} onClick={submitDrawHandle}>保存</Button>
        </>}
      >
        <DrawImgItem onRef={drawRef} modalData={canvasModal} />
      </Modal>

    </>
  );
};

export default ModalDraw;
