import {
  FC,
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';
import { Modal, Row, Col } from 'antd';

const CanvasVideo: FC<any> = ({
  modalData,
  modalHandle,
}) => {
  const { visible, url, points } = modalData;
  const videoDomRef = useRef(null);
  const canvasRef = useRef(null);
  const [sourceVideoSize, setSourceVideoSize] = useState<any>({
    width: 480,
    height: 360
  });
  const [initSize, setInitSize] = useState<boolean>(false);

  useEffect(() => {
    if (!initSize) return;
    (videoDomRef.current as any).addEventListener('canplay', () => {
      computeFrame(); // 显示对应帧
    });
    (videoDomRef.current as any).addEventListener('play', () => {
      timerCallback();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initSize]);

  // 监听dom元素渲染后，操作该dom
  const videoRef = useCallback((ref) => {
    if (!ref) return;
    videoDomRef.current = ref;
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLVideoElement/videoWidth 确保获取到源视频宽高
    (videoDomRef.current as any).addEventListener('loadedmetadata', () => {
      (videoDomRef.current as any).currentTime = 0; // 不设置获取不到首帧
      // init();
      const width = (videoDomRef.current as any).videoWidth; // 只读属性，源视频的宽
      const height = (videoDomRef.current as any).videoHeight; // 只读属性，源视频的高
      setSourceVideoSize({
        width,
        height
      });
      setInitSize(true);
      // console.log(sourceVideoSize, initSize);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // 实时绘制视频帧到canvas
  const timerCallback = () => {
    if ((videoDomRef.current as any).paused || (videoDomRef.current as any).ended) return;
    computeFrame();
    setTimeout(function() {
      timerCallback();
    }, 0);
  };

  const computeFrame = () => {
    const { width, height } = sourceVideoSize;
    const canvasContext = (canvasRef.current as any).getContext('2d');
    canvasContext.drawImage(videoDomRef.current, 0, 0, width, height);
    canvasContext.strokeStyle = '#f23030';
    canvasContext.strokeStyle = 2;
    canvasContext.beginPath();
    points.forEach((point: any, index: number) => {
      const { x, y } = point;
      if (!index) {
        canvasContext.moveTo(x, y);
        return;
      }
      canvasContext.lineTo(x, y);
    });
    // 移动到起点，进行闭合
    canvasContext.lineTo(points[0].x, points[0].y);
    canvasContext.stroke();
  };

  const closeHandle = () => {
    setInitSize(false);
    modalHandle(false);
  };

  return (
    <Modal
      title='查看视频'
      width={sourceVideoSize.width * 2 + 68}
      open={visible}
      destroyOnClose={true}
      maskClosable={false}
      keyboard={false}
      footer={null}
      onCancel={closeHandle}>
      <Row gutter={20}>
        <Col span={12}>
          <div className='ct mb-10'>
            源视频
          </div>
          <video
            ref={videoRef}
            src={url}
            width={sourceVideoSize.width}
            height={sourceVideoSize.height}
            controls
            crossOrigin='anonymous'>
          </video>
        </Col>
        <Col span={12}>
          <div className='ct mb-10'>
            已设置规则视频
          </div>
          <canvas
            ref={canvasRef}
            width={sourceVideoSize.width}
            height={sourceVideoSize.height}>
          </canvas>
        </Col>
      </Row>
    </Modal>
  );
};

export default CanvasVideo;
