import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type Cropper from 'react-easy-crop';
import type { CropperProps } from 'react-easy-crop';

export interface ImgCropProps {
  aspect?: number;
  shape?: 'rect' | 'round';
  grid?: boolean;
  quality?: number;
  fillColor?: string;

  zoom?: boolean;
  rotate?: boolean;
  minZoom?: number;
  maxZoom?: number;

  modalTitle?: string;
  modalWidth?: number | string;
  modalOk?: string;
  modalCancel?: string;
  modalMaskTransitionName?: string;
  modalClassName?: string;
  modalTransitionName?: string;
  onModalOk?: (file: void | boolean | string | Blob | File) => void;
  onModalCancel?: () => void;

  beforeCrop?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  onUploadFail?: (err: Error) => void;
  cropperProps?: Partial<CropperProps>;

  children: any;

  // 新增属性
  liveView?: boolean; // 预览
  controller?: boolean; // 控制器展示
  label?: string; // 裁剪提示
}

export interface LogoCropProps {
  aspect?: number;
  shape?: 'rect' | 'round';
  grid?: boolean;
  quality?: number;
  fillColor?: string;
  size?: number;
  fileType?: string[];

  zoom?: boolean;
  rotate?: boolean;
  minZoom?: number;
  maxZoom?: number;

  modalTitle?: string;
  modalWidth?: number | string;
  modalOk?: string;
  modalCancel?: string;
  modalMaskTransitionName?: string;
  modalClassName?: string;
  modalTransitionName?: string;
  onModalOk?: (file: void | boolean | string | Blob | File) => void;
  onModalCancel?: () => void;

  onUploadFail?: (err: Error) => void;
  cropperProps?: Partial<CropperProps>;

  // 新增属性
  visible: boolean;
  liveView?: boolean; // 预览
  controller?: boolean; // 控制器展示
  label?: string; // 裁剪提示
  liveStyle?: any; // 预览窗口样式
  onChange?: any; // 传递上传状态变化的方法
}

declare const ImgCrop: ForwardRefExoticComponent<
  ImgCropProps & RefAttributes<Cropper>
>;
export default ImgCrop;

export const PREFIX = 'img-crop';

export const INIT_ZOOM = 1;
export const ZOOM_STEP = 0.1;
export const INIT_ROTATE = 0;
export const ROTATE_STEP = 1;
export const MIN_ROTATE = -180;
export const MAX_ROTATE = 180;

