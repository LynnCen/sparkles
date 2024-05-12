import {
  FC,
  useEffect,
  useRef,
  useState,
  // forwardRef,
  useImperativeHandle
} from 'react';
import {
  Button,
  Tooltip,
  message as msg
} from 'antd';
import { deepCopy } from '@lhb/func';
import { getQiNiuToken } from '@/common/api/common';
import { Bucket, bucketMappingDomain, bucketMappingActionUrl } from '@/common/enums/qiniu';
import axios from 'axios';
import styles from '../index.module.less';
import { useMethods } from '@lhb/hook';

const DrawImgItem: FC<any> = ({
  modalData,
  onRef
}) => {
  const { imgSrc, width, height, id } = modalData;
  const startTip = '画布任意位置点击鼠标左键为起点，再次点击画布确认第二个点，并以此类推，当需要闭合图形时，可直接点击鼠标右键闭合图形，完成绘制';
  const mouseTip = '点此按钮可结束绘制';
  const resetTip = '清除画布上已绘制的图形，可重新开始绘制';
  // const delTip = '删除后，图片将会消失，可以点击左侧的开始按钮重新进行画面的选取';
  const lineConfig = {
    strokeStyle: '#f23030', // 线颜色
    width: 2, // 线宽
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap
    lineCap: 'round', // 线段末端的属性 butt 方形 round 圆形 square 方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin
    lineJoin: 'round' // 设定线条与线条间接合处的样式 round bevel miter
  };
  const canvasRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState<any>(null); // canvas的context
  const [pointsArr, setPointsArr] = useState<Array<any>>([]); // 坐标点
  const [isDrawing, setIsDrawing] = useState<boolean>(false); // 画布是否可以进行绘制的状态

  useEffect(() => {
    const targetRef = canvasRef.current as any;
    targetRef.oncontextmenu = function(e) { // 禁用右键后的默认菜单
      e.preventDefault();
    };
    if (targetRef.getContext) {
      setCanvasContext(targetRef.getContext('2d'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  // 初始化以图片为背景的画布
    canvasContext && initCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasContext]);
  useImperativeHandle(onRef, () => ({
    submit: () => submitHandle()
  }));
  const {
    initCanvas,
    mouseDownHandle,
    endDraw,
    emptyHandle,
    submitHandle,
    qiniuToken
  } = useMethods({
    initCanvas: () => {
      const cavasBgImg = new Image();
      cavasBgImg.crossOrigin = 'Anonymous'; // 解决跨域图片问题，要写在图片加载前
      cavasBgImg.src = imgSrc;
      cavasBgImg.onload = () => {
        canvasContext.drawImage(cavasBgImg, 0, 0, parseInt(width), parseInt(height));
      };
    },
    mouseDownHandle: (e) => {
      if (!isDrawing) return;
      // event.button 1 鼠标左键 2 鼠标右键 3 鼠标左右键同时按下
      const event = e || window.event;
      const { nativeEvent } = event; // react 事件系统
      if (e.button === 2 || e.button === 3) { // 点击右键,结束绘制
        const lastPoints = pointsArr[pointsArr.length - 1];
        const { x: lastPointX, y: lastPointY } = lastPoints;
        if (pointsArr.length > 3) { // 企点和终点相连
          const firstPoints = pointsArr[0];
          const { x: firstPointX, y: firstPointY } = firstPoints;
          canvasContext.beginPath();
          canvasContext.moveTo(lastPointX, lastPointY);
          canvasContext.lineTo(firstPointX, firstPointY);
          canvasContext.stroke();
        } else {
          msg.warning('不符合绘制多边形的规则（至少四条边）');
        }
        return;
      }
      // 取react的nativeEvent对象
      const { offsetX, offsetY } = nativeEvent;
      const coordinatePoint = {
        x: offsetX,
        y: offsetY
      };
      canvasContext.strokeStyle = lineConfig.strokeStyle;
      canvasContext.lineWidth = lineConfig.width;
      canvasContext.beginPath();
      if (pointsArr.length) { // 已有坐标点
      // 上一次
        const lastPoint = pointsArr[pointsArr.length - 1];
        // 将上一次的坐标作为两点之间的起点
        canvasContext.moveTo(lastPoint.x, lastPoint.y);
        // 将当前的坐标作为两点之间的终点
        canvasContext.lineTo(offsetX, offsetY);
        canvasContext.stroke();
        const newPointes = deepCopy(pointsArr);
        newPointes.push(coordinatePoint);
        setPointsArr(newPointes);
      } else {
        canvasContext.arc(offsetX, offsetY, 1, 0, 360); // 确定起点的一个圆点
        canvasContext.fillStyle = lineConfig.strokeStyle;
        canvasContext.fill();
        setPointsArr([coordinatePoint]);
      }
    },
    endDraw: () => {
    // if (!isDrawing) {
    //   msg.warning(`请点击下方【开始绘制】按钮后，点击鼠标左键进行绘制`);
    //   return;
    // }
      if (!pointsArr.length) {
        msg.warning(`请点击鼠标左键开始绘制`);
        return;
      }
      const lastPoints = pointsArr[pointsArr.length - 1];
      const { x: lastPointX, y: lastPointY } = lastPoints; // 最后一个点的坐标
      if (pointsArr.length > 3) {
        // 起点和终点相连
        const firstPoints = pointsArr[0]; // 起点
        const { x: firstPointX, y: firstPointY } = firstPoints;
        canvasContext.beginPath();
        canvasContext.moveTo(lastPointX, lastPointY);
        canvasContext.lineTo(firstPointX, firstPointY);
        canvasContext.stroke(); // 闭合
        setIsDrawing(false); // 绘制完毕后关闭设置为不可绘制的状态
      } else {
        msg.warning('不符合绘制多边形的规则（至少四条边）');
      }
    },
    emptyHandle: () => {
      setPointsArr([]); // 清空坐标点
      setIsDrawing(true); // 设置可绘制状态
      canvasContext.clearRect(0, 0, parseInt(width), parseInt(height));
      initCanvas();
    },
    qiniuToken: async () => {
      try {
        const { token } = await getQiNiuToken({ bucket: Bucket.Certs });
        return new Promise((resolve, reject) => {
          if (token) {
            resolve(token);
          } else {
            reject();
          }
        });
      } catch (error) {}
    },
    submitHandle: async () => {
      const token = await qiniuToken();
      // 上传图片到七牛云
      return new Promise((resolve, reject) => {
        (canvasRef.current as any).toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('token', token);
          formData.append('file', blob);
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
          };
          // 上传链接
          const upUrl = bucketMappingActionUrl[Bucket.Certs];
          const { data } = await axios.post(upUrl, formData, config);
          if (pointsArr) {
            resolve({
              id, // 视频分析任务id
              url: `${bucketMappingDomain['linhuiba-certs']}${data.key}`,
              points: pointsArr
            });
          } else {
            reject();
          }
        });
      });
    }
  });

  return (
    <div className={styles.modalCanvasDrawImg}>
      <div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={mouseDownHandle}>
        </canvas>
      </div>
      <div className='rt'>
        <Tooltip title={startTip} placement='bottom' color='#333'>
          <Button
            type='primary'
            onClick={() => setIsDrawing(true)}>
            开始绘制
          </Button>
        </Tooltip>
        <Tooltip title={mouseTip} placement='bottom' color='#333'>
          <Button onClick={() => endDraw()} className='mt-10'>
          结束绘制
          </Button>
        </Tooltip>
        <Tooltip title={resetTip} placement='bottom' color='#333'>
          <Button onClick={() => emptyHandle()} className='mt-10'>
          重新绘制
          </Button>
        </Tooltip>
        {/* <Tooltip title={delTip} placement='bottom' color='#333'>
          <Button
            type='dashed' onClick={() => tryAgian()}>
          删除图片
          </Button>
        </Tooltip> */}
      </div>
    </div>
  );
};
export default DrawImgItem;
