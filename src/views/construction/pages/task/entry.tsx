import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Table from '@/common/components/Data/V2Table';
import { taskData } from './ts-config';
import V2Container from '@/common/components/Data/V2Container';
import cs from 'classnames';
import { Typography } from 'antd';
import Drawer from './components/TaskDrawer';
import Filter from './components/Filter';
import V2Tabs from '@/common/components/Data/V2Tabs';
import { useMethods } from '@lhb/hook';

const { Link } = Typography;

const Task: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const [curInfo, setCurInfo] = useState<any>(taskData[0]);
  const onClick = (record) => {
    setOpen(true);
    setCurInfo(record);
  };

  const methods = useMethods({
    renderProgressState(value) {
      if (value === 1) {
        return (
          <div className={styles.progress}>
            <div className={styles.greyPoint}></div>
            <div>未开始</div>
          </div>
        );
      }

      if (value === 2) {
        return (
          <div className={styles.progress}>
            <div className={styles.bluePoint}></div>
            <div>进行中</div>
          </div>
        );
      }

      if (value === 3) {
        return (
          <div className={styles.progress}>
            <div className={styles.greenPoint}></div>
            <div>已完成</div>
          </div>
        );
      }
      if (value === 4) {
        return (
          <div className={styles.progress}>
            <div className={styles.redPoint}></div>
            <div>已逾期</div>
          </div>
        );
      }

      return '-';
    },
  });

  const defaultColumns = [
    { title: '序号', key: 'id', width: 100, dragChecked: true },
    {
      title: '门店名称',
      key: 'name',
      width: 100,
      dragChecked: true,
    },
    {
      title: '工作事项',
      key: 'workList',
      width: 100,
      dragChecked: true,
      render: (text, record) => <Link onClick={() => onClick(record)}>{text}</Link>,
    },
    {
      title: '进度状态',
      key: 'progressState',
      width: 100,
      dragChecked: true,
      render: (value) => {
        return methods.renderProgressState(value);
      },
    },
    { title: '负责人', key: 'personInCharge', width: 100, dragChecked: true },
    { title: '联系方式', key: 'phone', width: 100, dragChecked: true },
    { title: '计划开始时间', key: 'planStartDate', width: 110, dragChecked: true },
    { title: '计划完成时间', key: 'planOverDate', width: 110, dragChecked: true },
    { title: '实际开始时间', key: 'realStartDate', width: 110, dragChecked: true },
    { title: '实际完成时间', key: 'realOverDate', width: 110, dragChecked: true },
  ];

  const loadData = () => {
    return {
      dataSource: taskData,
      count: taskData.length,
    };
  };

  return (
    <div>
      <V2Container
        className={cs(styles.container, 'bg-fff', 'pd-20')}
        style={{ height: 'calc(100vh - 80px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: (
            <>
              <V2Tabs items={[{ key: '1', label: '筹建任务管理' }]} />
              <Filter />
            </>
          ),
        }}
      >
        <div className={styles.table}>
          <V2Table
            onFetch={loadData}
            defaultColumns={defaultColumns}
            rowKey='id'
            hideColumnPlaceholder
            emptyRender
            tableSortModule='consoleConstructionTask'
            // 64是分页模块的总大小， 42是table头部
            scroll={{ y: mainHeight - 64 - 62 }}
          />
        </div>
      </V2Container>
      <Drawer open={open} setOpen={setOpen} curInfo={curInfo} />
    </div>
  );
};

export default Task;
