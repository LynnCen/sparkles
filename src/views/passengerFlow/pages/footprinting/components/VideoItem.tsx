import { FC, useEffect, useRef, useState } from 'react';
import { Space, Row, Col, Button, Tooltip, message, Modal, Checkbox } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { VideoCameraFilled } from '@ant-design/icons';
import { videoItemAnalysis, videoBatchDelete } from '@/common/api/footprinting';
import { floorKeep, getKeysFromObjectArray } from '@lhb/func';
import styles from '../index.module.less';
import { CanvasDrawTypeEnum } from '../ts-config';
import { useClientSize } from '@lhb/hook';
import AnalysisImage from './AnalysisImage';
import AnalysisVideoModal from './AnalysisVideoModal';

// 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来
export const aspectFit = (imageWidth:number, imageHeight:number, canvasWidth:number, canvasHeight:number) => {
  // const imageRate = imageWidth / imageHeight;
  const imageRate = Number(floorKeep(imageWidth, imageHeight, 4, 2));
  // const canvasRate = canvasWidth / canvasHeight;
  const canvasRate = Number(floorKeep(canvasWidth, canvasHeight, 4, 2));
  let dx = 0; let dy = 0; let dw = 0; let dh = 0;
  if (imageRate >= canvasRate) {
    dw = canvasWidth;
    // dh = canvasWidth / imageRate;
    dh = Number(floorKeep(canvasWidth, imageRate, 4, 2));
  } else {
    dh = canvasHeight;
    // dw = canvasHeight * imageRate;
    dw = Number(floorKeep(canvasHeight, imageRate, 3, 2));
  }
  // dx = (canvasWidth - dw) / 2;
  dx = Number(floorKeep((floorKeep(canvasWidth, dw, 1, 2)), 2, 4, 2));
  // dy = (canvasHeight - dh) / 2;
  dy = Number(floorKeep((floorKeep(canvasHeight, dh, 1, 2)), 2, 4, 2));
  return { dx, dy, dw, dh };
};



const VideoItem: FC<any> = ({ info, setCanvasModal, loadData, onDelete, onUpdate, editImgId }) => {
  const {
    url, // 视频url
    hasCheckPoints, // 画框后的图片url
    id, // 视频id
    projectId, // 踩点任务id
    startTime,
    endTime,
    permissions,
    outdoorPoints, // 绘制过店
    indoorPoints, //  绘制进店
    number, // 视频编号
    statusName, // 分析状态
    status, // 分析状态码
    obId,
  } = info;
  const videoRef = useRef(null);
  const [isSet, canSet] = useState<boolean>(false); // 开始按钮是否可点击
  const [btnLock, setBtnLock] = useState<boolean>(false);
  const [deleteLock, setDeleteLock] = useState<boolean>(false);
  const isEdit = outdoorPoints?.length; // 是否是编辑状态（已经画过框）ps: 过店必须绘制
  const permissionsArr: Array<any> = getKeysFromObjectArray(permissions, 'event') as any;
  const canDelete = permissionsArr.includes('checkSpot:batchVideoDelete');
  const showAnalysis = permissionsArr.includes('checkSpot:projectAnalysis');
  const showReAnalysis = permissionsArr.includes('checkSpot:projectReAnalysis');
  // const showReAnalysis = permissionsArr.includes('checkSpot:projectReAnalysis');
  const [isShowVideo, setShowVideo] = useState<boolean>(false); //  显示视频或图片 true：显示视频 false 显示图片
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false); //  显示画框视频
  const size = useClientSize();

  useEffect(() => {
    if (editImgId && editImgId === id) {
      setShowVideo(false);
    }
  }, [editImgId]);

  useEffect(() => {
    // 视频首帧已经加载完成后按钮可点击
    (videoRef.current as any).addEventListener('loadedmetadata', () => {
      canSet(true);
    });
  }, []);

  // 设置规则/修改画框范围
  const setHandle = () => {
    if (!isSet) {
      // video首帧已经加载完
      message.warning(`视频资源未准备完毕，请稍等片刻`);
      return;
    }

    const videoWidth = (videoRef.current as any).videoWidth; // 获取原视频宽度（只读属性）
    const videoHeight = (videoRef.current as any).videoHeight;

    const imgCanvas: any = document.createElement('canvas');
    const canvasWidth = size.width - 140;
    const canvasHeight = size.height - 212;

    // 图片根据画布大小等比例缩放
    const local = aspectFit(videoWidth, videoHeight, canvasWidth, canvasHeight);

    // 计算出画布和图片的比例，用来缩放画框
    const xRate = Number(floorKeep(canvasWidth, videoWidth, 4, 2));
    const yRate = Number(floorKeep(canvasHeight, videoHeight, 4, 2));
    const setRate = xRate < yRate ? xRate : yRate;

    imgCanvas.width = local.dw;// 设置画布宽
    imgCanvas.height = local.dh;

    // console.log('setRate', setRate, videoWidth, videoHeight);

    imgCanvas.getContext('2d').drawImage(videoRef.current, 0, 0, local.dw, local.dh);
    const imgSrc = imgCanvas.toDataURL('image/png');
    setCanvasModal({
      id,
      visible: true, // 显示绘图弹窗
      imgSrc,
      width: local.dw, // 画布宽
      height: local.dh, // 画布高
      modalWidth: size.width, // 弹窗宽
      modalHeight: size.height - 134, // 弹窗高
      scale: setRate, // 缩放比例
      pointData: {
        [CanvasDrawTypeEnum.CROSS]: outdoorPoints || [],
        [CanvasDrawTypeEnum.ENTER]: indoorPoints || [],
      }
    });
  };

  // 删除视频
  const deleteHandle = () => {
    Modal.confirm({
      title: '删除视频',
      content: '确定删除该视频？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const params = {
          ids: [id],
          projectId,
        };
        setDeleteLock(true);
        videoBatchDelete(params).finally(() => {
          setDeleteLock(false);
          onDelete();
        });
      },
    });
  };

  // 指定视频的立即分析
  const analysisHandle = () => {
    Modal.confirm({
      title: `立即分析`,
      content: `确认立即分析吗`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const params = {
          id,
          projectId,
        };
        setBtnLock(true);
        videoItemAnalysis(params)
          .then(() => {
            loadData();
            onUpdate();
          })
          .finally(() => {
            setBtnLock(false);
          });
      },
    });
  };

  // 指定视频的重新分析
  const reAnalysisHandle = () => {
    let contentText:string = '';
    switch (statusName) {
      case '已完成':
        contentText = '当前视频已分析完成，重新分析将会覆盖数据请确认；点击确定则进行分析';
        break;
      case '分析中':
        contentText = '当前视频正在分析中，请是否需要重新分析？点击确定则进行分析';
        break;

      default:
        contentText = `当前视频分析状态是${statusName},确认重新分析吗`;
        break;
    }
    Modal.confirm({
      title: `重新分析`,
      content: contentText,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const params = {
          id,
          projectId,
        };
        setBtnLock(true);
        videoItemAnalysis(params)
          .then(() => {
            loadData();
            onUpdate();
          })
          .finally(() => {
            setBtnLock(false);
          });
      },
    });
  };

  return (
    <div className={styles.videoItem}>
      <div className='bold fn-16'>
        <Checkbox value={info}>
          <Space>
            <div className={styles.videoTitle}>
              <VideoCameraFilled /><span className='ml-4'>视频{number}{`${obId ? `; ob_id：${obId}` : ''}`}</span>
              <p className={styles.videoTime}>
                {`视频时间：${startTime} 至 ${endTime}`}
              </p>
            </div>
          </Space>
        </Checkbox>
      </div>
      <Row className='mt-10'>
        <Col span={24}>
          <div className={styles.videoAndImage}>
            { !!hasCheckPoints && !isShowVideo &&
            <AnalysisImage info={info} /> }
            <video
              ref={videoRef}
              src={url}
              width='100%'
              height='200px'
              controls
              crossOrigin='anonymous' />
            { !!hasCheckPoints && <Button className={styles.analysisSwitchButton} onClick={() => setShowVideo(!isShowVideo)}>返回{ isShowVideo ? '图片' : '视频' }</Button> }
          </div>
        </Col>
        <Col span={24}>
          {canDelete && (
            <Button className='mt-10 mr-10' disabled={deleteLock} onClick={deleteHandle}>
              删除视频
            </Button>
          )}
          {!isEdit && (
            <Tooltip title='' placement='right' color='#333'>
              <Button type='primary' className='mt-10 mr-10' onClick={setHandle}>
                开始设置
              </Button>
            </Tooltip>
          )}
          {showAnalysis && (
            <>
              <Button type='primary' className='mt-10 mr-10' disabled={btnLock} onClick={analysisHandle}>
                立即分析
              </Button>
              <Button className='mt-10 mr-10' onClick={setHandle}>
                修改画框范围
              </Button>
              {/* <Tooltip title='如需重新选择画面，需先删除已绘图片' placement='right' color='#333'>
                  <Button className='mt-10' onClick={() => tryAgian()}>
                    修改画框范围
                  </Button>
                </Tooltip> */}
            </>
          )}
          {showReAnalysis && (
            <>
              <Button type='primary' className='mt-10 mr-10' disabled={btnLock} onClick={reAnalysisHandle}>
                重新分析
              </Button>
              <Button className='mt-10 mr-10' onClick={setHandle}>
                修改画框范围
              </Button>
              {/* <Tooltip title='如需重新选择画面，需先删除已绘图片' placement='right' color='#333'>
                  <Button className='mt-10' onClick={() => tryAgian()}>
                    修改画框范围
                  </Button>
                </Tooltip> */}
            </>
          )}
          {status === 4 && (
            <>
              <Button className='mt-10 mr-10' onClick={() => setShowVideoModal(true)}>
                查看画框视频
              </Button>
            </>
          )}
        </Col>
      </Row>
      <AnalysisVideoModal id={id} open={showVideoModal} setOpen={setShowVideoModal} />
    </div>
  );
};

export default VideoItem;
