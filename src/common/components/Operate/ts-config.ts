import { ButtonProps } from 'antd/lib/button/button';

export interface OperateButtonProps extends ButtonProps {
  name: string;
  event: string;
  position?: 'front'; // 收起的位置，默认为end
}

export interface OperateProps {
  operateList: OperateButtonProps[]; // 操作按钮列表
  showBtnCount?: number;
  onClick?: Function;
}
export interface Permission {
  event: string;
  name: string;
}

export interface FormattingPermission extends Permission {
  isBatch: boolean;
  text: string;
  func: string;
  type?: boolean;
  disabled?: boolean;
}
