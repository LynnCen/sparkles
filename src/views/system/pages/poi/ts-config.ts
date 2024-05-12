export type ObjectProps = {[propname: string]: any};

export interface FilterProps {
  onSearch: Function;
  addReport: Function;
  operateList: any[]
}
// 弹窗需要的共通参数
export interface ModalProps {
  visible: boolean;
}
// 新增、编辑、删除、导出弹框
export interface OperateModalProps extends ModalProps {
  id: number;
}
