import { useState, useCallback, useRef, useImperativeHandle, forwardRef, memo, MutableRefObject } from 'react';
import AntSlider from 'antd/es/slider';
import Cropper, { CropperProps } from 'react-easy-crop';
import type { Dispatch, SetStateAction, ForwardedRef } from 'react';
import type { Point, Size, Area } from 'react-easy-crop/types';
import type { ImgCropProps } from '../ts-config';
import { PREFIX, INIT_ZOOM, ZOOM_STEP, INIT_ROTATE, ROTATE_STEP, MIN_ROTATE, MAX_ROTATE } from '../ts-config';
import Output from './Output';
import styles from '../index.module.less';
import cs from 'classnames';

export type EasyCropHandle = {
  rotateVal: number;
  setZoomVal: Dispatch<SetStateAction<number>>;
  setRotateVal: Dispatch<SetStateAction<number>>;
  cropPixelsRef: MutableRefObject<Area>;
};

interface EasyCropProps
  extends Required<Pick<ImgCropProps, 'aspect' | 'shape' | 'grid' | 'zoom' | 'rotate' | 'minZoom' | 'maxZoom'>> {
  liveOutPut?: boolean;
  cropperProps?: Partial<CropperProps>;
  controller?: boolean;
  label?: string;
  cropperRef: ForwardedRef<Cropper>;
  image: string;
  liveStyle?: any;
  classNames?: any;
  outLabel?: string;
}

const EasyCrop = forwardRef<EasyCropHandle, EasyCropProps>((props, ref) => {
  const {
    cropperRef,
    image,

    aspect,
    shape,
    grid,
    zoom,
    rotate,
    minZoom,
    maxZoom,
    cropperProps,
    liveOutPut = true,
    controller = false,
    liveStyle = {
      width: 88,
      height: 88,
    },
    label,
    classNames,
    outLabel = '预览',
  } = props;

  const [crop, onCropChange] = useState<Point>({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState<Size>({ width: 0, height: 0 });
  const [zoomVal, setZoomVal] = useState(INIT_ZOOM);
  const [rotateVal, setRotateVal] = useState(INIT_ROTATE);
  const cropPixelsRef = useRef<Area>({ width: 0, height: 0, x: 0, y: 0 });
  const [croppedArea, setCroppedArea] = useState<any>(null);

  const onMediaLoaded = useCallback(
    (mediaSize) => {
      const { width, height } = mediaSize;
      const ratioWidth = height * aspect;

      if (width > ratioWidth) {
        setCropSize({ width: ratioWidth, height });
      } else {
        setCropSize({ width, height: width / aspect });
      }
    },
    [aspect]
  );

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    cropPixelsRef.current = croppedAreaPixels;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      rotateVal,
      setZoomVal,
      setRotateVal,
      cropPixelsRef,
    }),
    [rotateVal]
  );
  return (
    <div className={cs(styles.easyCrop, classNames)}>
      <div className={styles.cropper}>
        <Cropper
          {...cropperProps}
          ref={cropperRef}
          image={image}
          crop={crop}
          cropSize={cropSize}
          onCropChange={onCropChange}
          aspect={aspect}
          cropShape={shape}
          showGrid={grid}
          zoomWithScroll={zoom}
          zoom={zoomVal}
          rotation={rotateVal}
          onZoomChange={setZoomVal}
          onRotationChange={setRotateVal}
          minZoom={minZoom}
          maxZoom={maxZoom}
          onMediaLoaded={onMediaLoaded}
          onCropComplete={onCropComplete}
          classes={{
            containerClassName: `${PREFIX}-container`,
            mediaClassName: `${PREFIX}-media`,
          }}
          onCropAreaChange={(croppedArea) => {
            setCroppedArea(croppedArea);
          }}
        />
        {label && <div className={styles.label}>{label}</div>}
        {zoom && controller && (
          <section className={`${PREFIX}-control ${PREFIX}-control-zoom`}>
            <button onClick={() => setZoomVal(zoomVal - ZOOM_STEP)} disabled={zoomVal - ZOOM_STEP < minZoom}>
              －
            </button>
            <AntSlider min={minZoom} max={maxZoom} step={ZOOM_STEP} value={zoomVal} onChange={setZoomVal} />
            <button onClick={() => setZoomVal(zoomVal + ZOOM_STEP)} disabled={zoomVal + ZOOM_STEP > maxZoom}>
              ＋
            </button>
          </section>
        )}
        {rotate && (
          <section className={`${PREFIX}-control ${PREFIX}-control-rotate`}>
            <button onClick={() => setRotateVal(rotateVal - ROTATE_STEP)} disabled={rotateVal === MIN_ROTATE}>
              ↺
            </button>
            <AntSlider min={MIN_ROTATE} max={MAX_ROTATE} step={ROTATE_STEP} value={rotateVal} onChange={setRotateVal} />
            <button onClick={() => setRotateVal(rotateVal + ROTATE_STEP)} disabled={rotateVal === MAX_ROTATE}>
              ↻
            </button>
          </section>
        )}
      </div>
      {liveOutPut && (
        <div className={styles.viewer}>
          {croppedArea && <Output image={image} shape={shape} liveStyle={liveStyle} croppedArea={croppedArea} />}
          <div className={styles.outputLabel}>{outLabel}</div>
        </div>
      )}
    </div>
  );
});

export default memo(EasyCrop);
