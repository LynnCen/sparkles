import { FC, useMemo } from 'react';
import styles from '../index.module.less';

const CROP_AREA_ASPECT = 3 / 2;

const Output: FC<any> = ({
  image,
  croppedArea,
  liveStyle,
  shape
}) => {

  const transform = useMemo(() => {
    if (!croppedArea) return {};
    const scale = 100 / croppedArea.width;
    return {
      x: `${-croppedArea.x * scale}%`,
      y: `${-croppedArea.y * scale}%`,
      scale,
      width: 'calc(100% + 0.5px)',
      height: 'auto'
    };
  }, [croppedArea]);

  return <div
    className={styles.output}
    style={{
      borderRadius: shape === 'round' ? '50%' : 'none',
      paddingBottom: `${100 / CROP_AREA_ASPECT}%`,
      ...liveStyle
    }}
  >
    <img src={image} alt='' style={{
      transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
      width: transform.width,
      height: transform.height
    }} />
  </div>;
};

export default Output;
