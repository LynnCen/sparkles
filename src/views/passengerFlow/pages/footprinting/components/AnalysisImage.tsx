/**
 * @Description 踩点宝视频分析，画线框图片渲染
 */
import { FC, useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import { floorKeep } from '@lhb/func';
import { unstable_batchedUpdates } from 'react-dom';
import { EyeOutlined } from '@ant-design/icons';
import AnalysisImageModal from './AnalysisImageModal';

export type AnalysisImageProps = {
  info: any; // 当前视频段数据
}

const AnalysisImage: FC<AnalysisImageProps> = ({ info }) => {
  const imageWrapRef = useRef<any>(null);
  const [indoorPolygon, setIndoorPolygon] = useState(''); // 进店多边形
  const [outdoorPolygon, setOutdoorPolygon] = useState(''); // 过店多边形
  const [renderWidth, setRenderWidth] = useState(0); // 渲染宽度
  const [renderHeight, setRenderHeight] = useState(0); // 渲染高度
  const [imageWidth, setImageWidth] = useState(0); // 原图宽度
  const [imageHeight, setImageHeight] = useState(0); // 原图高度
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (info) {
      convertPointToSvg();
    }
  }, [info]);

  /**
   * @description 转换canvas像素坐标点为SVG可渲染的矢量点
   */
  const convertPointToSvg = () => {
    if (!info.imageUrl && (info.indoorPoints || info.outdoorPoints)) {
      const imageData = new Image();
      imageData.src = info.coverUrl;
      imageData.crossOrigin = 'anonymous';
      imageData.addEventListener('load', () => {
        // 加载图片, 获取图片真实尺寸
        const iWidth = imageData.width;
        const iHeight = imageData.height;
        // 获取容器真实大小
        const dockerWidth = imageWrapRef.current?.getBoundingClientRect().width;
        const dockerHeight = imageWrapRef.current?.getBoundingClientRect().height;
        // 获取可完整渲染尺寸宽高的最大化缩放比例
        const tempWS = Number(floorKeep(dockerWidth, iWidth, 4, 2));
        const tempHS = Number(floorKeep(dockerHeight, iHeight, 4, 2));
        const renderScale = tempWS > tempHS ? tempHS : tempWS;
        // 获取图片可完整渲染尺寸
        const rWidth = iWidth * renderScale;
        const rHeight = iHeight * renderScale;
        const ip = info.indoorPoints.map(item => {
          return `${item.x},${item.y}`;
        }).join(' ');
        const op = info.outdoorPoints.map(item => {
          return `${item.x},${item.y}`;
        }).join(' ');
        unstable_batchedUpdates(() => {
          setRenderWidth(rWidth);
          setRenderHeight(rHeight);
          setImageWidth(iWidth);
          setImageHeight(iHeight);
          setIndoorPolygon(ip);
          setOutdoorPolygon(op);
        });
      });

    }
  };

  return (
    <div className={styles.analysisImage} ref={imageWrapRef}>
      <img src={info.imageUrl || info.coverUrl} width={renderWidth || '100%'} height={renderHeight || '100%'} />
      { !!outdoorPolygon && !info.imageUrl && (
        <svg width={renderWidth} height={renderHeight} viewBox={`0 0 ${imageWidth} ${imageHeight}`} className={styles.pointSvg}>
          <polygon points={outdoorPolygon} style={{ fill: 'transparent', stroke: 'rgb(255, 0, 0)', strokeWidth: 3 }} />
          { !!indoorPolygon && <polygon points={indoorPolygon} style={{ fill: 'transparent', stroke: 'rgb(0, 156, 94)', strokeWidth: 3 }} /> }
        </svg>
      ) }
      <div className={styles.maskContent} onClick={() => setOpen(true)}>
        <EyeOutlined /><span className={'ml-4'}>预览</span>
      </div>
      <AnalysisImageModal info={info} open={open} setOpen={setOpen} />
    </div>
  );
};

export default AnalysisImage;
