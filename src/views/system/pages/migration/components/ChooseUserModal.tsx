/* 选择接手员工弹框 */
import React, { useState } from 'react';
import { Modal, message } from 'antd';
// import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import ChooseUserFilter from './ChooseUserFilter';
import { ConfirmModal } from '@/common/components/Modal/ConfirmModal';
import { post } from '@/common/request';

const ChooseUserModal: React.FC<any> = ({ visible, setVisible, employeeId, selectedTask, onTaskSearch, onHomeSearch }) => {
  // const [mainHeight, setMainHeight] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<any>();

  const [params, setParams] = useState<any>({});
  const onSearch = (values: any) => {
    setParams({ ...values });
  };

  const onCancel = () => {
    setVisible(false);
    setParams({});
    setSelectedEmployee(null);
  };

  const onConfirm = () => {
    const params = {
      employeeId,
      transferEmployeeId: selectedEmployee.id,
      taskList: selectedTask.map((task) => ({ id: task.taskId, taskType: task.taskType })),
    };
    // https://yapi.lanhanba.com/project/497/interface/api/51141
    post('/yn/task/transfer/batch', params, true).then(() => {
      onTaskSearch({});
      onHomeSearch({});
      onCancel();
    });
  };

  const onSubmit = () => {
    if (selectedEmployee) {
      ConfirmModal({ onSure: onConfirm, content: `是否让【${selectedEmployee.name}】接手？` });
    } else {
      message.error('请选择接手员工');
    }
  };

  const loadData = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51127
    const result: any = await post('/user/list', params, {
      isMock: false,
      mockId: 497,
      mockSuffix: '/api',
    });
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  const defaultColumns = [
    {
      title: '姓名',
      key: 'name',
      width: 80,
    },
    {
      title: '手机号',
      width: 120,
      key: 'mobile',
    },
    {
      title: '部门',
      key: 'department',
    },
  ];

  return (
    <Modal
      title='选择接手员工'
      open={visible}
      width={600}
      // bodyStyle={{ height: 400 }}
      onOk={onSubmit}
      onCancel={onCancel}
      destroyOnClose
    >
      <ChooseUserFilter onSearch={onSearch} />
      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        rowKey='id'
        // 64是分页模块的总大小， 62是table头部
        scroll={{ y: 200 }}
        hideColumnPlaceholder
        pagination={false}
        rowSelection={{
          type: 'radio',
          onChange: (_, selectedRows) => {
            if (selectedRows && selectedRows.length) {
              setSelectedEmployee(selectedRows[0]);
            }
          },
        }}
      />
    </Modal>
  );
};

export default ChooseUserModal;
