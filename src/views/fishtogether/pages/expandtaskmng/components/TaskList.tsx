/**
 * @Description 加盟商详情页-拓店任务列表
 */
import { FC, useEffect, useState } from 'react';
import { Typography } from 'antd';
import V2Table from '@/common/components/Data/V2Table';
import styles from '../entry.module.less';
import TaskDrawer from './TaskDrawer';
import { franchiseeTaskList } from '@/common/api/fishtogether';

const { Link } = Typography;

const TaskList: FC<any> = ({
  franchiseeId,
}) => {
  const [currentInfo, setCurrentInfo] = useState<any>({}); // 操作的拓店任务
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 是否显示机会点详情页

  useEffect(() => {
  }, []);

  const loadData = async () => {
    console.log('TaskList loadData franchiseeId', franchiseeId);
    const data = await franchiseeTaskList({ id: franchiseeId });
    const tasks = Array.isArray(data) ? data : [];
    return { dataSource: tasks, count: tasks.length };
  };

  const defaultColumns = [
    {
      title: '任务名称',
      key: 'name',
      render: (text, record) => <Link onClick={() => taskDetailHandle(record)}>{text}</Link>,
    },
    {
      title: '类型',
      key: 'customerTypeName',
    },
    {
      title: '状态',
      key: 'statusName',
    },
    {
      title: '匹配点位总数',
      key: 'pointList',
      render: (pointList) => {
        if (pointList && pointList.length) {
          return pointList.length;
        }
        return 0;
      },
    },
  ];

  // 查看任务详情
  const taskDetailHandle = (record) => {
    record && setCurrentInfo(record);
    setDrawerVisible(true);
  };

  return (
    <>
      <div className={styles.point}>
        <div className={styles.title}>拓店任务</div>
      </div>
      {
        !!franchiseeId && <V2Table
          onFetch={loadData}
          defaultColumns={defaultColumns}
          rowKey='id'
          // scroll={{ y: 300 }}
          pagination={false}
          hideColumnPlaceholder
          type='easy'
        />
      }
      <TaskDrawer
        open={drawerVisible}
        setOpen={setDrawerVisible}
        taskId={currentInfo.id}
        taskName={currentInfo.name}/>
    </>
  );
};

export default TaskList;

