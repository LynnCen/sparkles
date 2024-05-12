/**
 * @Description
 */
import { FC, useEffect, useState } from 'react';
import V2Table from '@/common/components/Data/V2Table';
import Operate from '@/common/components/Operate';
import UpdateNameModal from './UpdateNameModal';
import ChangeStatusModal from './ChangeStatusModal';
import StatusRecords from './StatusRecords';
import { isArray, isNotEmpty, refactorPermissions } from '@lhb/func';
import { getShopList } from '@/common/api/expandStore/shop';
import { tenantCheck } from '@/common/api/common';
import { useMethods } from '@lhb/hook';
import TaskDetailDrawer from '@/common/components/business/ExpandStore/TaskDetailDrawer';
import CircleTaskDetailDrawer from '@/common/components/business/ExpandStore/CircleTaskDetailDrawer';
import V2Message from '@/common/components/Others/V2Hint/V2Message';

interface ListProps {
  mainHeight?: any;
  filters?: any;
  onRefresh?: any;
}

const List: FC<ListProps> = ({
  mainHeight, // 从V2Container透传过来的，必须挂到scroll上
  filters = {},
  onRefresh,
}) => {
  const [record, setRecord] = useState<any>({});
  const [nameVisible, setNameVisible] = useState<boolean>(false); // 编辑名称
  const [statusVisible, setStatusVisible] = useState<boolean>(false); // 变更状态
  const [taskVisible, setTaskVisible] = useState<boolean>(false); // 拓店任务
  const [recordsVisible, setRecordsVisible] = useState<boolean>(false); // 状态任务
  const [taskTemplateCode, setTaskTemplateCode] = useState<string>('');

  useEffect(() => {
    getTaskConfig();
  }, []);

  const getTaskConfig = async () => {
    const taskConfig = await tenantCheck();
    setTaskTemplateCode(taskConfig?.taskTemplateCode);
  };

  /**
   * @description 获取加载table表格数据。该函数依赖filters变化自动触发
   * @param params filters和搜索框参数
   * @return table数据
   */
  const loadData = async (params) => {
    const { objectList, totalNum } = await getShopList({ ...params });
    return {
      dataSource: isArray(objectList) ? objectList : [],
      count: totalNum,
    };
  };

  const methods = useMethods({
    handleEdit(record: any) {
      setRecord(record);
      setNameVisible(true);
    },
    handleChangeStatus(record: any) {
      setRecord(record);
      setStatusVisible(true);
    },
    handleTask(record: any) {
      // 数据来源 1:系统生成 2:导入
      if (record.origin === 2) {
        V2Message.warning('导入数据无拓店任务可查看');
        return;
      }
      setRecord(record);
      setTaskVisible(true);
    },
    handleStatusRecord(record: any) {
      setRecord(record);
      setRecordsVisible(true);
    },
  });

  const defaultColumns = [
    { key: 'id', title: '门店编号', width: 100, dragChecked: true },
    { key: 'name', title: '门店名称', width: '300px', dragChecked: true },
    { key: 'provinceName', title: '所在省份' },
    { key: 'cityName', title: '所在城市' },
    { key: 'businessType', title: '商圈类型', render: (value) => isNotEmpty(value) ? value : '-' },
    { key: 'address', title: '门店地址' },
    { key: 'statusName', title: '当前状态', width: 150 },
    { key: 'originName', title: '数据来源', width: 150 },
    {
      key: 'permissions',
      title: '操作',
      fixed: 'right',
      width: 180,
      render: (value: any, record) => (
        <Operate
          showBtnCount={5}
          operateList={refactorPermissions(value || [])}
          onClick={(btn: any) => methods[btn.func](record)}
        />
      ),
    }
  ];

  return (
    <>
      <V2Table
        defaultColumns={defaultColumns}
        onFetch={loadData}
        hideColumnPlaceholder={true}
        filters={filters}
        rowKey='id'
        // 64是分页模块的总大小， 42是table头部
        scroll={{ y: mainHeight - 64 - 42 }}
      />

      {/* 编辑 */}
      <UpdateNameModal visible={nameVisible} setVisible={setNameVisible} record={record} onRefresh={onRefresh}/>

      {/* 变更状态 */}
      <ChangeStatusModal visible={statusVisible} setVisible={setStatusVisible} record={record} onRefresh={onRefresh}/>

      {/* 拓店任务 */}
      {taskTemplateCode === 'clusterA' ? <CircleTaskDetailDrawer
        id={record.taskId}
        open={taskVisible}
        setOpen={setTaskVisible}
      /> : <TaskDetailDrawer
        id={record.taskId}
        open={taskVisible}
        setOpen={setTaskVisible}
      />}

      {/* 状态记录 */}
      <StatusRecords id={record.id} open={recordsVisible} setOpen={setRecordsVisible}/>
    </>
  );
};

export default List;
