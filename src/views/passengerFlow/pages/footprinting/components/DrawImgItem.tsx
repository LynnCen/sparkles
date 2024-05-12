import {
  FC,
  useEffect,
  useRef,
  useState,
  // forwardRef,
  useImperativeHandle
} from 'react';
import {
  Radio,
  message,
  // Button,
  // Tooltip,
} from 'antd';
import { deepCopy, each, floorKeep, isNotEmptyAny } from '@lhb/func';
import { getQiNiuToken } from '@/common/api/common';
import { Bucket, bucketMappingDomain, bucketMappingActionUrl } from '@/common/enums/qiniu';
import axios from 'axios';
import styles from '../index.module.less';
import { useMethods } from '@lhb/hook';
import CircleTag from '@/common/components/CircleTag';
import { CanvasDrawTypeColorEnum, CanvasDrawTypeEnum, CanvasDrawTypeOptions } from '../ts-config';

const DrawImgItem: FC<any> = ({
  modalData,
  onRef
}) => {
  const { imgSrc, width, height, id, scale } = modalData;
  const lineConfig = {
    width: 2, // 线宽
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap
    lineCap: 'round', // 线段末端的属性 butt 方形 round 圆形 square 方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin
    lineJoin: 'round' // 设定线条与线条间接合处的样式 round bevel miter
  };
  const canvasRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState<any>(null); // canvas的context
  const [pointData, setPointData] = useState<any>({}); //  坐标点数据
  const [typeActive, setTypeActive] = useState(CanvasDrawTypeEnum.CROSS); //  绘制类型， 1：过店 2：进店
  const [canvasBgImg, setCanvasBgImg] = useState<any>(null); // 需要绘制的图片

  useEffect(() => {
    if (isNotEmptyAny(modalData.pointData)) {
      // 保存的点数据是原图尺寸坐标，需要根据缩放倍数缩小画布 画框点
      const scalePointData = deepCopy(modalData.pointData);
      each(scalePointData, (item: any) => {
        return item.map(v => {
          v.x = floorKeep(v.x, scale, 3, 2);
          v.y = floorKeep(v.y, scale, 3, 2);
        });
      });
      setPointData({ ...scalePointData });
    }
  }, [modalData.pointData]);

  useEffect(() => {
    const targetRef = canvasRef.current as any;
    targetRef.oncontextmenu = function (e) { // 禁用右键后的默认菜单
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
    submit: submitHandle,
    clear: emptyHandle,
    strokeDoneDraw: strokeDoneDraw
  }));
  const {
    initCanvas,
    updateCanvas,
    mouseDownHandle,
    emptyHandle,
    submitHandle,
    qiniuToken,
    canvasDrawTypeChange,
    strokeDoneDraw,
  } = useMethods({
    initCanvas: () => {
      canvasContext.clearRect(0, 0, parseInt(width), parseInt(height));
      const initCanvasBgImg = new Image();
      initCanvasBgImg.crossOrigin = 'Anonymous'; // 解决跨域图片问题，要写在图片加载前
      initCanvasBgImg.src = imgSrc;
      initCanvasBgImg.onload = () => {
        setCanvasBgImg(initCanvasBgImg);
        // canvasContext.scale(scale, scale); // 执行该句后；后续绘制每像素单位为之前的2倍
        canvasContext.drawImage(initCanvasBgImg, 0, 0, parseInt(width), parseInt(height));
        if (isNotEmptyAny(pointData)) {
          setTimeout(() => {
            updateCanvas(false, 'all');
          }, 0);
        }
      };
    },
    /**
     * @description 重新绘制画板相关内容
     * @property {Boolean} drawImg  true // 是否需要重新绘制图片
     * @property {String} closeKey  需要闭合的多边形的key
     */
    updateCanvas: (drawImg = true, closeKey) => {
      if (canvasBgImg) {
        if (drawImg) {
          canvasContext.drawImage(canvasBgImg, 0, 0, parseInt(width), parseInt(height));
        }
        // 实例化 清空并实例化时，如果另一个类型已绘制则需要保留
        for (const key in pointData) {
          if (pointData[key]?.length) {
            const firstPoints = pointData[key][0];
            canvasContext.strokeStyle = key === CanvasDrawTypeEnum.CROSS ? CanvasDrawTypeColorEnum.CROSS : CanvasDrawTypeColorEnum.ENTER;
            canvasContext.lineWidth = lineConfig.width;
            canvasContext.beginPath();
            canvasContext.moveTo(firstPoints.x, firstPoints.y);
            for (let i = 0; i < pointData[key].length; i++) {
              const currentPoint = pointData[key][i];
              canvasContext.lineTo(currentPoint.x, currentPoint.y);
            }
            // 如果 传入的 key 和 当前的key相同，则闭合多边形
            if (pointData[key].length > 3 && (key === closeKey || closeKey === 'all')) {
              canvasContext.lineTo(firstPoints.x, firstPoints.y);
            }
            canvasContext.stroke();
          }
        }
      }
    },
    //  结束绘制，并闭合多边形
    strokeDoneDraw: () => {
      if (pointData[typeActive]?.length && pointData[typeActive].length > 3) {
        const lastPoints = pointData[typeActive][pointData[typeActive].length - 1];
        const { x: lastPointX, y: lastPointY } = lastPoints;
        const firstPoints = pointData[typeActive][0];
        const { x: firstPointX, y: firstPointY } = firstPoints;
        canvasContext.strokeStyle = typeActive === CanvasDrawTypeEnum.CROSS ? CanvasDrawTypeColorEnum.CROSS : CanvasDrawTypeColorEnum.ENTER;
        canvasContext.beginPath();
        canvasContext.moveTo(lastPointX, lastPointY);
        canvasContext.lineTo(firstPointX, firstPointY);
        canvasContext.stroke();
        console.log('结束绘制，并闭合多边形', pointData);
      }
    },
    mouseDownHandle: (e) => {
      // event.button 1 鼠标左键 2 鼠标右键 3 鼠标左右键同时按下
      const event = e;
      const { nativeEvent } = event; // react 事件系统
      if (e.button === 2 || e.button === 3) { // 点击右键,结束绘制
        strokeDoneDraw();
        return;
      }
      // 取react的nativeEvent对象
      const { offsetX, offsetY } = nativeEvent;
      const coordinatePoint = {
        x: offsetX,
        y: offsetY
      };
      canvasContext.strokeStyle = typeActive === CanvasDrawTypeEnum.CROSS ? CanvasDrawTypeColorEnum.CROSS : CanvasDrawTypeColorEnum.ENTER;
      canvasContext.lineWidth = lineConfig.width;
      canvasContext.beginPath();
      if (pointData[typeActive]?.length) { // 已有坐标点
        // 上一次
        const lastPoint = pointData[typeActive][pointData[typeActive].length - 1];
        // const firstPoints = pointData[typeActive][0];
        // 将上一次的坐标作为两点之间的起点
        canvasContext.moveTo(lastPoint.x, lastPoint.y);
        // 将当前的坐标作为两点之间的终点
        canvasContext.lineTo(offsetX, offsetY);
        canvasContext.stroke();
        const newPointes = deepCopy(pointData[typeActive]);
        newPointes.push(coordinatePoint);
        setPointData({
          ...pointData,
          [typeActive]: newPointes
        });
        // 如果当前编辑的是过店，那么需要闭合进店的多边形，反之亦然
        let key = '';
        typeActive === CanvasDrawTypeEnum.CROSS ? key = CanvasDrawTypeEnum.ENTER : key = CanvasDrawTypeEnum.CROSS;
        setTimeout(() => {
          if (pointData[typeActive].length >= 3) {
            updateCanvas(true, key);
          }
        }, 0);
      } else {
        canvasContext.arc(offsetX, offsetY, 3, 0, 360); // 确定起点的一个圆点
        canvasContext.fillStyle = typeActive === CanvasDrawTypeEnum.CROSS ? CanvasDrawTypeColorEnum.CROSS : CanvasDrawTypeColorEnum.ENTER;
        canvasContext.fill();
        setPointData({
          ...pointData,
          [typeActive]: [coordinatePoint]
        });
      }
    },
    emptyHandle: () => {
      setPointData({
        ...pointData,
        [typeActive]: []
      }); // 清空坐标点
      canvasContext.clearRect(0, 0, parseInt(width), parseInt(height));
      // 如果当前编辑的是过店，那么需要闭合进店的多边形，反之亦然
      let key = '';
      typeActive === CanvasDrawTypeEnum.CROSS ? key = CanvasDrawTypeEnum.ENTER : key = CanvasDrawTypeEnum.CROSS;
      setTimeout(() => {
        updateCanvas(true, key);
      }, 0);
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
      } catch (error) { }
    },
    submitHandle: async () => {
      strokeDoneDraw();
      // 保存时需要将缩放过的点坐标根据比例放大
      const reScalePointData = deepCopy(pointData);
      each(reScalePointData, (item: any) => {
        return item.map(v => {
          v.x = floorKeep(v.x, scale, 4, 2);
          v.y = floorKeep(v.y, scale, 4, 2);
        });
      });
      const outdoorPoints = reScalePointData?.[CanvasDrawTypeEnum.CROSS] || [];
      const indoorPoints = reScalePointData?.[CanvasDrawTypeEnum.ENTER] || [];
      if (!outdoorPoints.length) {
        message.warn('过店规则不能为空');
        return new Promise((_, reject) => reject());
      }
      if (outdoorPoints.length && outdoorPoints.length <= 3) {
        message.warning('过店不符合绘制多边形的规则（至少四条边）');
        return new Promise((_, reject) => reject());
      }
      if (indoorPoints.length && indoorPoints.length <= 3) {
        message.warning('进店不符合绘制多边形的规则（至少四条边）');
        return new Promise((_, reject) => reject());
      }

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
          if (pointData[CanvasDrawTypeEnum.CROSS]?.length || pointData[CanvasDrawTypeEnum.ENTER]?.length) {
            resolve({
              id, // 视频分析任务id
              url: `${bucketMappingDomain['linhuiba-certs']}${data.key}`,
              pointData: reScalePointData
            });
          } else {
            reject();
          }
        });
      });
    },
    canvasDrawTypeChange(event) {
      const value = event.target.value;
      const outdoorPoints = pointData?.[CanvasDrawTypeEnum.CROSS] || [];
      const indoorPoints = pointData?.[CanvasDrawTypeEnum.ENTER] || [];
      // 过店必填，进店选填
      if (value === CanvasDrawTypeEnum.ENTER) {
        if (outdoorPoints.length && outdoorPoints.length > 3) {
          strokeDoneDraw();
          setTypeActive(value);
        }
        if (!outdoorPoints.length) {
          message.warn('过店规则不能为空');
        }
        if (outdoorPoints.length && outdoorPoints.length <= 3) {
          message.warning('过店不符合绘制多边形的规则（至少四条边）');
        }
      } else {
        // 如果当前编辑的是进店，如果至少有一个点，则需要校验四边形规则
        if (indoorPoints.length && indoorPoints.length > 3) {
          strokeDoneDraw();
          setTypeActive(value);
        }
        if (indoorPoints.length && indoorPoints.length <= 3) {
          message.warning('进店不符合绘制多边形的规则（至少四条边）');
        }
        if (!indoorPoints.length) {
          setTypeActive(value);
        }
      }


    }
  });

  return (
    <>
      <Radio.Group
        options={CanvasDrawTypeOptions}
        onChange={canvasDrawTypeChange}
        value={typeActive}
        optionType='button' />
      <div className={styles.modalCanvasDrawImg}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={mouseDownHandle}>
        </canvas>
        <div className={styles.canvasRight}>
          <CircleTag name='过店' color='#FF0000' />
          <CircleTag name='进店' color='#009C5E' className={'mt-8'} />
        </div>
      </div>
    </>

  );
};
export default DrawImgItem;
