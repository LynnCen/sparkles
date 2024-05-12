/* 选择接手员工弹框 */
import React, { useState } from 'react';
import { Form, Modal } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { getEmployeeTransferTask } from '@/common/api/system';
import { userList } from '@/common/api/brief';
import { V2Confirm } from '@/common/components/Others/V2Confirm';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import SearchForm from '@/common/components/Form/SearchForm';

const ChooseUserModal: React.FC<any> = ({
  visible,
  setVisible,
  employeeId,
  selectedTask, // 选中的迁移任务
  onTaskRefresh, // 刷新任务列表
  onHomeRefresh // 刷新首页列表
}) => {
  const [searchForm] = Form.useForm();
  const [selectedEmployee, setSelectedEmployee] = useState<any>();
  const [params, setParams] = useState<any>({});

  /** 搜索 */
  const onSearch = () => {
    const _params = searchForm.getFieldsValue();
    setParams({ ..._params });
  };

  /** 取消/关闭 */
  const onCancel = () => {
    setParams({});
    setSelectedEmployee(null);
    searchForm.resetFields();
    setVisible(false);

  };

  /** 确认 */
  const onConfirm = (modal?) => {
    console.log('selectedTask', selectedTask);
    const params = {
      employeeId,
      transferEmployeeId: selectedEmployee.id,
      taskList: selectedTask,
    };
    getEmployeeTransferTask(params).then(() => {
      onTaskRefresh(); // 刷新任务列表
      onHomeRefresh(); // 刷新首页列表
      modal && modal.destroy();
      onCancel();
    });

  };

  /** 提交 */
  const onSubmit = () => {
    if (selectedEmployee) {
      V2Confirm({ onSure: (modal: any) => onConfirm(modal), content: `是否让【${selectedEmployee.name}】接手？` });
    } else {
      V2Message.warning('请选择接手员工');
    }
  };

  /** 加载数据 */
  const loadData = async (params) => {
    const result: any = await userList(params);
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
      <SearchForm labelLength={4}
        form={searchForm}
        onSearch={onSearch}
      >
        <V2FormInput
          label=''
          name='keyword'
          placeholder='请输入接手员工的姓名或者手机号'
          config={{ allowClear: true, style: { width: 300 } }}
        />
      </SearchForm>

      <V2Table
        onFetch={loadData}
        filters={params}
        defaultColumns={defaultColumns}
        rowKey='id'
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
