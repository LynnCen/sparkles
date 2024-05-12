/**
 * @Description 加盟商的任务列表
 */
import { FC, useEffect, useState } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import V2Table from '@/common/components/Data/V2Table';
import TaskDetailDrawer from '@/common/components/business/ExpandStore/TaskDetailDrawer';
import styles from '../index.module.less';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { getExpansionTaskList } from '@/common/api/expandStore/expansiontask';

const TaskList: FC<any> = ({
  franchiseeId,
  refresh,
}) => {
  const [filters, setFilters] = useState<any>({}); // 筛选参数
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false); // 拓店任务详情是否可见
  const [taskId, setTaskId] = useState<any>(0);

  useEffect(() => {
    // 刷新列表
    franchiseeId && setFilters({
      franchiseeId,
    });
  }, [franchiseeId]);

  /**
   * @description 加载表格数据
   */
  const loadData = async(params: any) => {
    const { objectList, totalNum } = await getExpansionTaskList(params);
    return {
      dataSource: isArray(objectList) ? objectList : [],
      count: totalNum,
    };
  };

  /**
   * @description 点击名称查看详情
   * @param record 当前选中点击某一行的数据
   */
  const onClickDetail = (record) => {
    setTaskId(record.id);
    setShowDetailDrawer(true); // 显示弹窗
  };

  const defaultColumns = [{
    key: 'name',
    title: '任务名称',
    width: 317,
    importWidth: true,
    render: (value, record) => {
      return isNotEmptyAny(value) ? (
        <span className={styles.name} onClick={() => onClickDetail(record)}>{value}</span>
      ) : '-';
    },
  }, {
    key: 'statusName',
    title: '任务状态',
    width: 300,
    render: (value) => isNotEmptyAny(value) ? value : '-',
  }, {
    key: 'manager',
    title: '开发经理',
    width: 300,
    render: (value) => isNotEmptyAny(value) ? value : '-',
  }];

  return (
    <div className={styles.taskList} >
      <V2Title type='H2' text='拓店任务' divider/>
      <V2Table
        filters={filters}
        rowKey='id'
        defaultColumns={defaultColumns}
        hideColumnPlaceholder
        onFetch={loadData}
        pageSize={10}
        paginationConfig={{
          pageSizeOptions: [10, 20, 50, 100],
        }}
        scroll={{ y: 550 }}
        className='mt-16'
      />
      <TaskDetailDrawer
        id={taskId}
        open={showDetailDrawer}
        setOpen={setShowDetailDrawer}
        outterRefresh={() => refresh && refresh()}
      />
    </div>
  );
};

export default TaskList;
