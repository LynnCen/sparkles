import V2Table from '@/common/components/Data/V2Table';
import V2Drawer from '@/common/components/Feedback/V2Drawer';
import { FC, useEffect, useState } from 'react';
import V2Title from '@/common/components/Feedback/V2Title';
import { Col, Divider, Row, Typography } from 'antd';
import styles from './index.module.less';
import { useMethods } from '@lhb/hook';
import { taskData } from '../../task/ts-config';
import TaskDrawer from '../../task/components/TaskDrawer';

const { Link } = Typography;

const ProjectDrawer: FC<any> = ({ open, setOpen, curInfo }) => {
  const [taskDrawerOpen, setTaskDrawerOpen] = useState<boolean>(false);
  const [curTaskInfo, setCurTaskInfo] = useState<any>({});

  const onClick = (record) => {
    setTaskDrawerOpen(true);
    setCurTaskInfo(record);
  };

  const methods = useMethods({
    renderProgressState(value) {
      if (value === 1) {
        return <div style={{ color: '#999999' }}>未开始</div>;
      }
      if (value === 2) {
        return <div style={{ color: '#006AFF' }}>进行中</div>;
      }
      if (value === 3) {
        return <div style={{ color: '#009963' }}>已完成</div>;
      }
      if (value === 4) {
        return <div style={{ color: '#F23030' }}>已逾期</div>;
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
      render: () => curInfo.name,
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

  const onClose = () => {
    setOpen(false);
  };

  const renderConstructState = (value) => {
    if (value === 1) {
      return '筹建中';
    }
    if (value === 2) {
      return '待交房';
    }
    if (value === 3) {
      return '已开业';
    }
    return '-';
  };

  useEffect(() => {
    if (open) {
      console.log(curInfo);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curInfo, open]);

  return (
    <div>
      <V2Drawer open={open} onClose={onClose} destroyOnClose>
        <>
          <V2Title>
            <span className='fn-20'>{curInfo?.name || '杭州9号'}</span>
          </V2Title>
          <Divider style={{ marginTop: 24, marginBottom: 16 }} />

          <V2Title divider type='H3'>
            <span className='font-weight-500'>基础信息</span>
          </V2Title>

          <div className={styles.baseInfo}>
            <Row>
              <Col span={6}>
                <div className={styles.info}>
                  <div className={styles.value}>{curInfo?.planOpenDate}</div>
                  <div className={styles.label}>计划开业时间</div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.info}>
                  <div className={styles.value}>{curInfo?.personInCharge || '-'}</div>
                  <div className={styles.label}>筹建负责人</div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.info}>
                  <div className={styles.value}>
                    <span className={styles.state}>{renderConstructState(curInfo.constructState)}</span>
                  </div>
                  <div className={styles.label}>目前状态</div>
                </div>
              </Col>
              <Col span={6}>
                <div className={styles.info}>
                  <div className={styles.value}>
                    <span className={styles.point}></span>
                    {curInfo?.name1 || '正常'}
                  </div>
                  <div className={styles.label}>进度状态</div>
                </div>
              </Col>
            </Row>
          </div>
          <V2Table
            onFetch={loadData}
            defaultColumns={defaultColumns}
            rowKey='id'
            hideColumnPlaceholder
            emptyRender
            tableSortModule='consoleConstructionOverviewDraw'
            // 64是分页模块的总大小， 42是table头部
            scroll={500}
          />
        </>
      </V2Drawer>
      <TaskDrawer open={taskDrawerOpen} setOpen={setTaskDrawerOpen} curInfo={curTaskInfo} />
    </div>
  );
};
export default ProjectDrawer;
