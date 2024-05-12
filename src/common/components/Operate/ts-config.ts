import { ButtonProps } from 'antd/lib/button/button';

export interface OperateButtonProps extends ButtonProps {
  event: string;
  name: string;
  func?: string;
  isBatch?: boolean; // 默认为false
  text?: string;
}

export interface OperateProps {
  /**
   * @description 按钮列表
   */
  operateList: OperateButtonProps[]; // 操作按钮列表
  /**
   * @description 平铺的按钮，默认三个及以下按钮进行平铺
   * @default 3
   */
  showBtnCount?: number;
  /**
   * @description 点击按钮事件
   */
  onClick?: Function;
  /**
   * @description 更多按钮的位置，默认为end 收起按钮的样式默认为link(文本样式)， 如需改变样式，默认取列表最后一个的type
   */
  position?: 'front' | 'end'; // 收起的位置，默认为end
  classNames?: string;
}

export interface Permission {
  event: string;
  name: string;
}
