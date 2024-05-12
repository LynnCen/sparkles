import React from 'react';
import { Badge } from 'antd';
import Table from '@/common/components/FilterTable';
import { TaskListProps } from '../ts-config';
import { useMethods } from '@lhb/hook';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import Operate from '@/common/components/Operate';
import { FormattingPermission } from '@/common/components/Operate/ts-config';
import { dispatchNavigate } from '@/common/document-event/dispatch';
// import { stopRadarTask } from '@/common/api/radar';
import { TaskStatus } from '../ts-config';
import { stopRadarTask } from '@/common/api/radar';
import { refactorPermissions } from '@lhb/func';

const TaskList: React.FC<TaskListProps> = ({ loadData, params, onSearch }) => {
  const columns = [
    { key: 'name', title: '任务名称' },
    { key: 'taskTypeName', title: '任务类型' },
    { key: 'queryChannelName', title: '渠道' },
    { key: 'creatorName', title: '创建人' },
    { key: 'gmtCreateStr', title: '创建时间' },
    { key: 'statusCode', title: '状态', render: (value: any, record: any) => renderStatus(value, record) },
    { key: 'runTime', title: '总执行时间' },
    { key: 'permissions', title: '操作',
      render: (value: any, record: any) => (
        <Operate
          showBtnCount={4}
          operateList={refactorPermissions(value)}
          onClick={(btn: FormattingPermission) => methods[btn.func](record)}
        />
      ),
    }
  ];

  const { renderStatus, ...methods } = useMethods({
    renderStatus(value, record) {
      // console.log('renderStatus', value, typeof value, record);
      return (
        <>
          {value === TaskStatus.WAIT && <><Badge status='warning' />待执行</>}
          {value === TaskStatus.PROCESSING && <><Badge status='processing' />执行中</>}
          {value === TaskStatus.HANGUP && <><Badge status='processing' />已挂起</>}
          {value === TaskStatus.COMPLETE && <><Badge status='success' />已完成</>}
          {value === TaskStatus.FAIL && <><Badge status='error' />失败</>}
          {value === TaskStatus.STOP && <><Badge status='default' />已停止</>}
          {record.status}
        </>
      );
    },
    renderType(value) {
      return (
        <>
          {value === 'CATEGORY_TASK' && '类别任务'}
          {value === 'BRAND_TASK' && '品牌任务'}
        </>
      );
    },
    // 详情
    handleDetail(record: any) {
      dispatchNavigate(encodeURI(`radarmng/detail?noRouter=true&id=${record.id}&name=${record.name}&status=${record.statusName}&queryChannel=${record.queryChannelName}&creator=${record.creatorName || ''}&gmtCreate=${record.gmtCreateStr}&runTime=${record.runTime || ''}&taskTypeName=${record.taskTypeName || '暂无数据'}&taskType=${record.taskType || ''}`));
    },
    // 停止
    handleStop(record: any) {
      ConfirmModal({
        title: '确认要停止该任务?',
        content: '',
        onSure: (modal) => {
          // console.log('停止', record.id);
          stopRadarTask({ id: record.id }).then(() => {
            modal.destroy();
            onSearch();
          });
        }
      });
    }
  });

  return (
    <>
      <Table
        rowKey='id'
        scroll={{ x: false }}
        onFetch={loadData}
        filters={params}
        columns={columns}
      />
    </>
  );
};

export default TaskList;
