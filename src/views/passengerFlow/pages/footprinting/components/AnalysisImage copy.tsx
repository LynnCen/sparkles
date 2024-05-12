/**
 * @Description 踩点宝视频分析，画线框图片渲染
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import { floorKeep } from '@lhb/func';
import { unstable_batchedUpdates } from 'react-dom';
import { EyeOutlined } from '@ant-design/icons';

export type AnalysisImageProps = {
  info: any; // 当前视频段数据
}

const AnalysisImage: FC<AnalysisImageProps> = ({ info }) => {
  const imageWrapRef = useRef<any>(null);
  const [indoorPolygon, setIndoorPolygon] = useState(''); // 进店多边形
  const [outdoorPolygon, setOutdoorPolygon] = useState(''); // 过店多边形
  const [renderWidth, setRenderWidth] = useState(0); // 渲染宽度
  const [renderHeight, setRenderHeight] = useState(0); // 渲染高度

  useEffect(() => {
    if (info) {
      convertPointToSvg();
    }
  }, [info]);

  /**
   * @description 转换canvas像素坐标点为SVG可渲染的矢量点
   */
  const convertPointToSvg = () => {
    if (info.imageUrl && (info.indoorPoints || info.outdoorPoints)) {
      const imageData = new Image();
      imageData.src = info.coverUrl;
      imageData.crossOrigin = 'anonymous';
      imageData.addEventListener('load', () => {
        // 加载图片, 获取图片真实尺寸
        const iWidth = imageData.width;
        const iHeight = imageData.height;
        // 获取容器真实大小
        const dockerWidth = imageWrapRef.current.getBoundingClientRect().width;
        const dockerHeight = imageWrapRef.current.getBoundingClientRect().height;
        // 获取可完整渲染尺寸宽高的最大化缩放比例
        const tempWS = Number(floorKeep(dockerWidth, iWidth, 4, 2));
        const tempHS = Number(floorKeep(dockerHeight, iHeight, 4, 2));
        const renderScale = tempWS > tempHS ? tempHS : tempWS;
        // 获取图片可完整渲染尺寸
        const rWidth = iWidth * renderScale;
        const rHeight = iHeight * renderScale;
        // 获取x/y各自的缩放比例
        const xScale = Number(floorKeep(rWidth, iWidth, 4, 2));
        const yScale = Number(floorKeep(rHeight, iHeight, 4, 2));
        // 获取SVG多边形真实可渲染尺寸
        const ip = info.indoorPoints.map(item => {
          return `${floorKeep(item.x, xScale, 3, 2)},${floorKeep(item.y, yScale, 3, 2)}`;
        }).join(' ');
        const op = info.outdoorPoints.map(item => {
          return `${floorKeep(item.x, xScale, 3, 2)},${floorKeep(item.y, yScale, 3, 2)}`;
        }).join(' ');
        unstable_batchedUpdates(() => {
          setRenderWidth(rWidth);
          setRenderHeight(rHeight);
          setIndoorPolygon(ip);
          setOutdoorPolygon(op);
        });
      });

    }
  };

  return (
    <div className={styles.analysisImage} ref={imageWrapRef}>
      <img src={info.imageUrl || info.coverUrl} width={renderWidth} height={renderHeight} />
      <svg width={renderWidth} height={renderHeight} className={styles.pointSvg}>
        <polygon points={outdoorPolygon} style={{ fill: 'transparent', stroke: 'rgb(255, 0, 0)', strokeWidth: 1 }} />
        <polygon points={indoorPolygon} style={{ fill: 'transparent', stroke: 'rgb(0, 156, 94)', strokeWidth: 1 }} />
      </svg>
      <div className={styles.maskContent}>
        <EyeOutlined /><span className={'ml-4'}>预览</span>
      </div>
    </div>
  );
};

export default AnalysisImage;
