import { ReactNode } from 'react';

export interface TemplateAssetsProps {
  url: string;
  name: string;
  [p: string]: any;
}

export interface ImportModalProps {
  // formRef?: any; // 经 Form.useForm() 创建的 form 控制实例
  title?: ReactNode; // 弹窗标题
  isOpen: boolean; // 弹框是否可见
  modalWidth?: number, // 弹窗默认宽度
  defaultSpan?: number, // 默认内容时的span
  rightSpan?: number, // 右侧span
  firstStepContent?: ReactNode; // 自定义第一步内容
  firstStepTemplateContent?: ReactNode; // 自定义第一步模板内容
  templateAssets?: TemplateAssetsProps[]; // 第一步的模板内容
  firstStepHint?: ReactNode; // 第一步提示语
  secondStepHint?: ReactNode; // 第二步提示语
  v2TitleProps?: Object; // v2Title组件的props，可通过该props自定义
  V2DetailItemProps?: Object; // V2DetailItem组件的props，可通过该props自定义
  modalProps?: Object; // 弹窗组件的props，可通过该props自定义
  uploadConfig?: Object; // 自定义上传组件的config
  uploadFetchConfig?: any; // 上传时的接口请求
  uploadProps?: Object; // 自定义上传组件的props
  rightSlot?: ReactNode; // 自定义右侧内容
  customUploadFetch?: (value, callback) => void; // 自定义处理上传逻辑
  finallyData?: (val) => void; // 上传成功后将接口返回的数据抛出去
  closeModal: () => void; // 关闭弹窗

}
