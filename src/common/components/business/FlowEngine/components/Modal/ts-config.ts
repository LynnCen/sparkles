import { ModalProps } from 'antd';

export type ObjectProps = { [propname: string]: any };

// 弹窗方法
interface ModalFunctionProps {
  onClose: () => void; // 关闭弹窗
  onOk: () => void; // 确定
}

// 修改跟进人
export interface ChangeFollowerProps extends ModalFunctionProps {
  editFollower: ObjectProps;
}

export interface CheckUsers extends ObjectProps {
  id: number;
  name: string;
}

// 选择用户弹窗的参数
export interface PermissionSelectorValues {
  visible: boolean;
  users: CheckUsers[];
  id?: number;
  name?: string;
}

export interface PermissionSelectorProps extends ModalFunctionProps {
  values: PermissionSelectorValues;
  title: string;
  type?: 'ONE' | 'MORE'; // 单选/多选
  requestUrl?: ''; // 请求链接
}

/**
 * 自定义弹出框
 */
export type ModalCustomProps = ModalProps
