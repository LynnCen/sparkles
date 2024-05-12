import { Button, Form, message, Typography } from 'antd';
import V2Container from '@/common/components/Data/V2Container';
import V2Table from '@/common/components/Data/V2Table';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2Operate from '@/common/components/Others/V2Operate';

import SearchForm from '@/common/components/Form/SearchForm';
import ChooseUserModal from './ChooseUserModal';

import TaskDetailDrawer from '@/common/components/business/ExpandStore/TaskDetailDrawer';
import CircleTaskDetailDrawer from '@/common/components/business/ExpandStore/CircleTaskDetailDrawer';
import ChancePointDteailDrawer from '@/common/components/business/ExpandStore/ChancePointDetail/components/Deatil';
import DetailDrawer from '@/views/expandstore/pages/approver/components/DetailDrawer';

import React, { FC, useEffect, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isNotEmptyAny, refactorPermissions } from '@lhb/func';
import { ApprovalType_Enums, TaskType_Enums } from '../ts-config';
import { getEmployeeTaskList, getTaskTypeSelections } from '@/common/api/system';
import { tenantCheck } from '@/common/api/common';
import { dispatchNavigate } from '@/common/document-event/dispatch';

interface TaskInfoType {
  /** 该条任务id */
  id: number;
  /** 该条任务类型 */
  type: TaskType_Enums;
}

const { Link } = Typography;

const TaskListDrawer: FC<any> = ({ open, setOpen, employeeId, onHomeRefresh }) => {
  const [searchForm] = Form.useForm();
  const [filters, setFilters] = useState<any>({});
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false); // 抽屉是否可见
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 选择id数组
  const [selectedItems, setSelectedItems] = useState<{ id: number; taskType: number }[]>(); // 选择项
  const [typeOptions, setTypeOptions] = useState<any>([]); // 任务类型下拉字段
  const [taskIdType, setTaskIdType] = useState<TaskInfoType>(); // 选中的任务id
  const [detailDrawerVisible, setDeatilDrawerVisible] = useState<boolean>(false); // 任务详情是否可见
  const [taskTemplateCode, setTaskTemplateCode] = useState<string>('');

  useEffect(() => {
    loadStatusOptions();
    getTaskConfig();
  }, []);

  const getTaskConfig = async () => {
    const taskConfig = await tenantCheck();
    setTaskTemplateCode(taskConfig?.taskTemplateCode);
  };

  const onSearch = () => {
    const _params = searchForm.getFieldsValue();
    setFilters({ ...filters, ..._params });
  };

  //  关闭弹窗
  const onClose = () => {
    setOpen(false);
    onInitPage();
  };

  //  初始化
  const onInitPage = () => {
    setFilters({});
    setSelectedRowKeys([]);
    setSelectedItems([]);
    searchForm.resetFields();
  };

  /** 任务类型下拉项 */
  const loadStatusOptions = async () => {
    const result = await getTaskTypeSelections({ selectionType: 1 });

    setTypeOptions(result || []);
  };

  const { ...methods } = useMethods({
    // 手动单个迁移
    handleMigrate(record) {
      const { taskId: id, taskType, nodeId } = record || {};
      console.log('record', record);
      const taskList = [{ id, taskType, nodeId }];
      setSelectedItems(taskList); // 接口参数
      setVisible(true);
    },

    // 批量分派
    handleBatchMigrate() {
      if (selectedRowKeys.length === 0) {
        message.warn('请选择要迁移的任务！');
        return;
      }
      setVisible(true);
    },

    // 点击任务查看任务详情
    handleTask(record) {
      const { taskId: id, taskType: type } = record;
      // 网规审批类型，跳转到网规详情
      if (record.approvalTypeValue === ApprovalType_Enums.NetworkPlan && type === TaskType_Enums.APPROVAL) {
        dispatchNavigate(`/recommend/networkplanapprove?id=${id}`);
        return;
      }
      if (record.approvalTypeValue === ApprovalType_Enums.AddNetWork && type === TaskType_Enums.APPROVAL) {
        dispatchNavigate(`/recommend/addprojectapprove?id=${id}`);
        return;
      }
      setTaskIdType({ id, type });
      setDeatilDrawerVisible(true);
    },
  });

  // 渲染名称
  const renderName = (value, record) => {
    if (record.taskType === TaskType_Enums.PLAN_SPOT) {
      return value;
    }
    return <Link onClick={() => methods.handleTask(record)}>{value}</Link>;
  };

  const defaultColumns = [
    {
      title: '任务编号',
      key: 'id',
      width: 100
    },
    {
      title: '任务名称',
      key: 'taskName',
      render: (value, record) => renderName(value, record),
    },
    {
      title: '任务类型',
      key: 'taskTypeName',
      render: (val) => (isNotEmptyAny(val) ? val : '-'),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      fixed: 'right',
      render: (value: any, record) => (
        <V2Operate
          operateList={refactorPermissions([{ name: '迁移', event: 'migrate' }])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    },
  ];
  const loadData = async (params) => {
    const result = await getEmployeeTaskList({ ...params, employeeId });
    return {
      dataSource: result?.objectList || [],
      count: result?.totalNum || 0,
    };
  };

  // 拓店
  const isExpandTask =
    taskIdType?.type === TaskType_Enums.TASK_CREATOR || taskIdType?.type === TaskType_Enums.TASK_ASSIGN;
  // 审批
  const isApproval =
    taskIdType?.type === TaskType_Enums.TASK_CHANGE ||
    taskIdType?.type === TaskType_Enums.SHOP_EVALUATION ||
    taskIdType?.type === TaskType_Enums.APPROVAL;

  /** 点击选中品牌  */
  const onSelectChange = (keys: React.Key[], record) => {
    const taskList = record.map(({ taskId: id, taskType, nodeId }) => ({
      id,
      taskType,
      nodeId,
    }));
    setSelectedRowKeys(keys); // 存储数组
    setSelectedItems(taskList); // 接口参数
  };

  /** V2Table中多选配置项*/
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    preserveSelectedRowKeys: true, // 保留上一次选择参数，不设置会丢失之前的多选参数
    onChange: onSelectChange,
  };

  return (
    <>
      <V2Drawer open={open} onClose={onClose} destroyOnClose>
        <V2Container
          style={{ height: 'calc(100vh - 48px)' }}
          emitMainHeight={(h) => setMainHeight(h)}
          extraContent={{
            top: (
              <div>
                <SearchForm labelLength={4} form={searchForm} onSearch={onSearch}>
                  <V2FormInput label='任务名称' name='taskName' placeholder='请输入任务名称' />
                  <V2FormSelect
                    label='任务类型'
                    name='taskTypes'
                    mode='multiple' // 多选
                    allowClear
                    options={typeOptions}
                    config={{
                      maxTagCount: 'responsive',
                      fieldNames: { label: 'name', value: 'id' },
                      allowClear: true,
                    }}
                  />
                </SearchForm>
                <Button type='primary' className='mb-16' onClick={methods.handleBatchMigrate}>
                  批量分派
                </Button>
              </div>
            ),
          }}
        >
          <V2Table
            defaultColumns={defaultColumns}
            onFetch={loadData}
            filters={filters}
            scroll={{ x: '100%', y: mainHeight - 64 - 40 }}
            hideColumnPlaceholder
            rowSelection={rowSelection}
            rowKey='id'
          />
        </V2Container>

        {/* 拓店任务类型详情 */}
        {isExpandTask && (
          taskTemplateCode === 'clusterA' ? <CircleTaskDetailDrawer
            id={taskIdType?.id}
            isHistory
            open={detailDrawerVisible}
            setOpen={setDeatilDrawerVisible}
            hideOperate
          /> : <TaskDetailDrawer
            id={taskIdType?.id}
            isHistory
            open={detailDrawerVisible}
            setOpen={setDeatilDrawerVisible}
            hideOperate
          />
        )}
        {/* 机会点详情组件 */}
        {taskIdType?.type === TaskType_Enums.CHANCE_POINT && (
          <ChancePointDteailDrawer
            id={taskIdType?.id}
            open={detailDrawerVisible}
            setOpen={setDeatilDrawerVisible}
            hideOperate
          />
        )}

        {/* 审批抽屉 */}
        {isApproval && (
          <DetailDrawer
            id={taskIdType?.id} // recordId
            open={detailDrawerVisible} // 是否可见
            setOpen={setDeatilDrawerVisible}
            hideOperate={true}
          />
        )}
      </V2Drawer>
      <ChooseUserModal
        visible={visible}
        setVisible={setVisible}
        employeeId={employeeId}
        selectedTask={selectedItems}
        onTaskRefresh={() => {
          setFilters({});
          onInitPage();
        }}
        onHomeRefresh={onHomeRefresh}
      />
    </>
  );
};
export default TaskListDrawer;
