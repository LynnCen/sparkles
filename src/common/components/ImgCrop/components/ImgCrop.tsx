import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
} from 'react';
import AntModal from 'antd/es/modal';
import AntUpload from 'antd/es/upload';
import LocaleReceiver from 'antd/es/locale-provider/LocaleReceiver';
import type Cropper from 'react-easy-crop';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { version as AntdVersion } from 'antd';
import type { ImgCropProps } from '../ts-config';
import type { EasyCropHandle } from './EasyCrop';
import { PREFIX, INIT_ZOOM, INIT_ROTATE } from '../ts-config';
import EasyCrop from './EasyCrop';
import { compareVersion } from './helper';
import './ImgCrop.less';

const ImgCrop = forwardRef<Cropper, ImgCropProps>((props, ref) => {
  const {
    aspect = 1,
    shape = 'rect',
    grid = false,
    quality = 0.4,
    fillColor = 'white',

    zoom = true,
    rotate = false,
    minZoom = 1,
    maxZoom = 3,

    modalTitle,
    modalWidth,
    modalOk,
    modalCancel,
    modalMaskTransitionName,
    modalTransitionName,
    modalClassName,
    onModalOk,
    onModalCancel,

    beforeCrop,
    onUploadFail,
    cropperProps,
    children,

    liveView,
    controller,
    label
  } = props;
  const cb = useRef<
    Pick<
      ImgCropProps,
      'onModalOk' | 'onModalCancel' | 'beforeCrop' | 'onUploadFail'
    >
  >({});
  cb.current.onModalOk = onModalOk;
  cb.current.onModalCancel = onModalCancel;
  cb.current.beforeCrop = beforeCrop;
  cb.current.onUploadFail = onUploadFail;

  /**
   * Upload
   */
  const [image, setImage] = useState('');
  const fileRef = useRef<RcFile>();
  const beforeUploadRef = useRef<UploadProps['beforeUpload']>();
  const resolveRef = useRef<ImgCropProps['onModalOk']>();
  const rejectRef = useRef<(err: Error) => void>();

  const uploadComponent = useMemo(() => {
    const upload = Array.isArray(children) ? children[0] : children;
    const { beforeUpload, accept, ...restUploadProps } = upload.props;
    beforeUploadRef.current = beforeUpload;

    return {
      ...upload,
      props: {
        ...restUploadProps,
        accept: accept || 'image/*',
        beforeUpload: (file, fileList) => {
          return new Promise(async (resolve, reject) => {
            if (cb.current.beforeCrop) {
              const shouldCrop = await cb.current.beforeCrop(file, fileList);
              if (!shouldCrop) {
                return reject();
              }
            }

            fileRef.current = file;
            resolveRef.current = (newFile) => {
              cb.current.onModalOk?.(newFile);
              resolve(newFile);
            };
            rejectRef.current = (uploadErr) => {
              cb.current.onUploadFail?.(uploadErr);
              reject();
            };

            const reader = new FileReader();
            reader.addEventListener('load', () => {
              if (typeof reader.result === 'string') {
                setImage(reader.result);
              }
            });
            reader.readAsDataURL(file);
          });
        },
      },
    };
  }, [children]);

  /**
   * Crop
   */
  const easyCropRef = useRef<EasyCropHandle>({} as EasyCropHandle);

  /**
   * Modal
   */
  const modalProps = useMemo(() => {
    const obj = {
      width: modalWidth,
      okText: modalOk,
      cancelText: modalCancel,
      maskTransitionName: modalMaskTransitionName,
      transitionName: modalTransitionName,
    };
    Object.keys(obj).forEach((key) => {
      if (!obj[key]) delete obj[key];
    });
    return obj;
  }, [
    modalCancel,
    modalMaskTransitionName,
    modalOk,
    modalTransitionName,
    modalWidth,
  ]);

  const onClose = () => {
    setImage('');
    easyCropRef.current.setZoomVal(INIT_ZOOM);
    easyCropRef.current.setRotateVal(INIT_ROTATE);
  };

  const onCancel = useCallback(() => {
    cb.current.onModalCancel?.();
    onClose();
  }, []);

  const onOk = useCallback(async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onClose();
    const canvas = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    const target = event.target;
    // @ts-ignore
    const context = target && target.getRootNode ? target.getRootNode() : document;
    const imgSource = context.querySelector(
      `.${PREFIX}-media`
    ) as any & {
      naturalWidth: number;
      naturalHeight: number;
    };
    const {
      width: cropWidth,
      height: cropHeight,
      x: cropX,
      y: cropY,
    } = easyCropRef.current.cropPixelsRef.current;

    if (rotate && easyCropRef.current.rotateVal !== INIT_ROTATE) {
      const { naturalWidth: imgWidth, naturalHeight: imgHeight } = imgSource;
      const angle = easyCropRef.current.rotateVal * (Math.PI / 180);

      // get container for rotated image
      const sine = Math.abs(Math.sin(angle));
      const cosine = Math.abs(Math.cos(angle));
      const squareWidth = imgWidth * cosine + imgHeight * sine;
      const squareHeight = imgHeight * cosine + imgWidth * sine;

      canvas.width = squareWidth;
      canvas.height = squareHeight;
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, squareWidth, squareHeight);

      // rotate container
      const squareHalfWidth = squareWidth / 2;
      const squareHalfHeight = squareHeight / 2;
      ctx.translate(squareHalfWidth, squareHalfHeight);
      ctx.rotate(angle);
      ctx.translate(-squareHalfWidth, -squareHalfHeight);

      // draw rotated image
      const imgX = (squareWidth - imgWidth) / 2;
      const imgY = (squareHeight - imgHeight) / 2;
      ctx.drawImage(
        imgSource,
        0,
        0,
        imgWidth,
        imgHeight,
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );

      // crop rotated image
      const imgData = ctx.getImageData(0, 0, squareWidth, squareHeight);
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.putImageData(imgData, -cropX, -cropY);
    } else {
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, cropWidth, cropHeight);

      ctx.drawImage(
        imgSource,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
    }

    // get the new image
    if (!fileRef.current) return;
    const { type, name, uid } = fileRef.current;
    canvas.toBlob(
      async (blob: any) => {
        const newFile = Object.assign(new File([blob], name, { type }), {
          uid,
        }) as RcFile;

        if (!beforeUploadRef.current) {
          return (resolveRef as any).current(newFile);
        }

        const result = await beforeUploadRef.current(newFile, [newFile]);

        if (result === true) {
          return (resolveRef as any).current(newFile);
        }

        if (result === false) {
          return (rejectRef as any).current(new Error('beforeUpload return false'));
        }

        delete newFile[AntUpload.LIST_IGNORE];
        if (result === AntUpload.LIST_IGNORE) {
          Object.defineProperty(newFile, AntUpload.LIST_IGNORE, {
            value: true,
            configurable: true,
          });
          return (rejectRef as any).current(
            new Error('beforeUpload return LIST_IGNORE')
          );
        }

        if (typeof result === 'object' && result !== null) {
          return (resolveRef as any).current(result);
        }
      },
      type,
      quality
    );
  }, [fillColor, quality, rotate]);

  const visibleProp = compareVersion(AntdVersion, '4.23.0') === -1 ? { visible: true } : { open: true };

  const getComponent = (titleOfModal) => (
    <>
      {uploadComponent}
      {image && (
        <AntModal
          {...visibleProp}
          wrapClassName={`${PREFIX}-modal ${modalClassName || ''}`}
          title={titleOfModal}
          onOk={onOk}
          onCancel={onCancel}
          maskClosable={false}
          destroyOnClose
          {...modalProps}
        >
          <EasyCrop
            ref={easyCropRef}
            cropperRef={ref}
            image={image}
            aspect={aspect}
            shape={shape}
            grid={grid}
            zoom={zoom}
            rotate={rotate}
            minZoom={minZoom}
            maxZoom={maxZoom}
            cropperProps={cropperProps}
            liveOutPut={liveView}
            controller={controller}
            label={label}
          />
        </AntModal>
      )}
    </>
  );

  if (modalTitle) {
    return getComponent(modalTitle);
  }

  return (
    <LocaleReceiver>
      {(locale, code) => {
        return getComponent(code === 'zh-cn' ? '编辑图片' : 'Edit image');
      }}
    </LocaleReceiver>
  );
});

export default ImgCrop;
