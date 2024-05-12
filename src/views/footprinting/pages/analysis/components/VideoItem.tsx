import { FC, useEffect, useRef, useState } from 'react';
import { Space, Row, Col, Button, Tooltip, Image, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { VideoCameraFilled } from '@ant-design/icons';
import { videoItemAnalysis, videoBatchDelete } from '@/common/api/footprinting';
import { getKeysFromObjectArray } from '@lhb/func';

const VideoItem: FC<any> = ({ info, setCanvasModal, loadData, onDelete, onUpdate }) => {
  const {
    url, // 视频url
    imageUrl, // 画框后的图片url
    id, // 视频id
    projectId, // 踩点任务id
    startTime,
    endTime,
    permissions,
    checkPoints, // 画框的点
    number, // 视频编号
    statusName, // 分析状态
  } = info;
  const videoRef = useRef(null);
  const videoSize = {
    width: '240px',
    height: '135px',
  };
  const [isSet, canSet] = useState<boolean>(false); // 开始按钮是否可点击
  const [btnLock, setBtnLock] = useState<boolean>(false);
  const [deleteLock, setDeleteLock] = useState<boolean>(false);
  const isEdit = Array.isArray(checkPoints) && checkPoints.length > 0; // 是否是编辑状态（已经画过框）
  const permissionsArr: Array<any> = getKeysFromObjectArray(permissions, 'event') as any;
  const canDelete = permissionsArr.includes('checkSpot:batchVideoDelete');
  const showAnalysis = permissionsArr.includes('checkSpot:projectAnalysis');
  const showReAnalysis = permissionsArr.includes('checkSpot:projectReAnalysis');

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
    imgCanvas.width = videoWidth; // 设置画布宽
    imgCanvas.height = videoHeight;
    imgCanvas.getContext('2d').drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    const imgSrc = imgCanvas.toDataURL('image/png');
    setCanvasModal({
      id,
      visible: true, // 显示绘图弹窗
      imgSrc,
      width: videoWidth, // 画布宽
      height: videoHeight, // 画布高
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
    Modal.confirm({
      title: `重新分析`,
      content: `当前视频分析状态是${statusName},确认重新分析吗`,
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
    <>
      <div className='mt-20'>
        <div className='bold fn-18'>
          <Space>
            <VideoCameraFilled />
            <div>
              视频{number}
              <span className='color-info fn-12 ff-normal'>
                （{startTime} 至 {endTime}）
              </span>
            </div>
          </Space>
        </div>
        <Row className='mt-10'>
          <Col span={15}>
            <video
              ref={videoRef}
              src={url}
              width={videoSize.width}
              height={videoSize.height}
              controls
              crossOrigin='anonymous'
            ></video>
          </Col>
          <Col span={6}>
            {canDelete && (
              <Button className='mt-10' disabled={deleteLock} onClick={deleteHandle}>
                删除视频
              </Button>
            )}
            {!isEdit && (
              <Tooltip title='' placement='right' color='#333'>
                <Button type='primary' className='mt-10' onClick={setHandle}>
                  开始设置
                </Button>
              </Tooltip>
            )}
            {imageUrl && (
              <div className='mt-10'>
                <Image height={100} width={100} src={imageUrl} />
              </div>
            )}

            {showAnalysis && (
              <>
                <Button type='primary' className='mt-10' disabled={btnLock} onClick={analysisHandle}>
                  立即分析
                </Button>
                <Button className='mt-10' onClick={setHandle}>
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
                <Button type='primary' className='mt-10' disabled={btnLock} onClick={reAnalysisHandle}>
                  重新分析
                </Button>
                <Button className='mt-10' onClick={setHandle}>
                  修改画框范围
                </Button>
                {/* <Tooltip title='如需重新选择画面，需先删除已绘图片' placement='right' color='#333'>
                    <Button className='mt-10' onClick={() => tryAgian()}>
                      修改画框范围
                    </Button>
                  </Tooltip> */}
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default VideoItem;
