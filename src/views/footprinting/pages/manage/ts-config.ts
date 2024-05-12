export interface EditTaskModalProps {
  visible: boolean;
  id?: number;
  projectCode?: string;
  demandBrandName?: string
  placeName?: string
}

export interface AssignTaskModalProps {
  visible: boolean;
  id?: number;
  checkWay?: number;
  checkerName?: string;
  checkerPhone?: string;
}

export interface TaskDetailDrawProps {
  visible: boolean;
  id?: number;
}
