import { TaskStatus } from '@/common/components/business/ExpandStore/ts-config';

/** 任务状态颜色值 */
export const TaskStatusColor = {
  [TaskStatus.WaitAssign]: {
    background: 'rgba(146,165,202,0.07)',
    color: '#222222',
  },
  [TaskStatus.Processing]: {
    background: 'rgba(255, 134, 29, 0.06)',
    color: '#FF861D'
  },
  [TaskStatus.Changed]: {
    background: 'rgba(245, 63, 63, 0.08)',
    color: '#F53F3F',
  },
  [TaskStatus.Complete]: {
    background: 'rgba(0, 153, 99, 0.06)',
    color: '#009963',
  },
  [TaskStatus.Closed]: {
    background: 'rgba(146, 165, 202, 0.07)',
    color: '#7886A1',
  },
};
