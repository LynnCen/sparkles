import { TaskTab } from '@/common/components/business/ExpandStore/ts-config';

/**
 * @Description
 */
export default {
  meta: {
    title: '拓店任务', // 拓店任务-标准版
  },
};


export const initialTab = [
  { label: '我发起的', key: TaskTab.Created },
  { label: '指派给我的', key: TaskTab.AssignMe },
  { label: '待指派', key: TaskTab.WaitAssign },
];
