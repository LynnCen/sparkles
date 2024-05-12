import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Table from '@/common/components/Data/V2Table';
import { projectData } from './ts-config';
import V2Container from '@/common/components/Data/V2Container';
import cs from 'classnames';
import { Typography } from 'antd';
import ProjectDrawer from './components/ProjectDrawer';
import Filter from './components/Filter';
import V2Tabs from '@/common/components/Data/V2Tabs';
import V2Operate from '@/common/components/Others/V2Operate';
import { useMethods } from '@lhb/hook';
import ChooseUserModal from './components/ChooseUserModal';
import { refactorPermissions } from '@lhb/func';

const { Link } = Typography;

const Project: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [curInfo, setCurInfo] = useState<any>(projectData[0]);
  const onClick = (record) => {
    setOpen(true);
    setCurInfo(record);
  };

  const methods = useMethods({
    handleChooseUser() {
      setVisible(true);
    },
    renderConstructState(value) {
      if (value === 1) {
        return <div style={{ color: '#006AFF' }}>筹建中</div>;
      }
      if (value === 2) {
        return <div style={{ color: '#FF861D' }}>待交房</div>;
      }
      if (value === 3) {
        return <div style={{ color: '#009963' }}>已开业</div>;
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
      render: (text, record) => <Link onClick={() => onClick(record)}>{text}</Link>,
    },
    { title: '所属分公司', key: 'branchCompany', width: 100, dragChecked: true },
    { title: '签约日期', key: 'handoverDate', width: 100, dragChecked: true },
    { title: '交房日期', key: 'handoverDate', width: 100, dragChecked: true },
    { title: '计划开业', key: 'handoverDate', width: 100, dragChecked: true },
    {
      title: '筹建状态',
      key: 'constructState',
      width: 100,
      dragChecked: true,
      render: (value) => {
        return methods.renderConstructState(value);
      },
    },
    {
      title: '进度状态',
      key: 'progressState',
      width: 100,
      dragChecked: true,
      render: (value) =>
        value === 1 ? (
          <div className={styles.progress}>
            <div className={styles.greenPoint}></div>
            <div>正常</div>
          </div>
        ) : (
          <div className={styles.progress}>
            <div className={styles.redPoint}></div>
            <div>延期</div>
          </div>
        ),
    },
    { title: '当前进度', key: 'progressState', width: 100, dragChecked: true },
    {
      title: '筹建负责人',
      key: 'personInCharge',
      width: 100,
      dragChecked: true,
      render: (value) =>
        value || (
          <V2Operate
            operateList={refactorPermissions([{ name: '指定责任人', event: 'chooseUser' }])}
            onClick={(btn: any) => methods[btn.func](value)}
          />
        ),
    },
  ];

  const loadData = () => {
    return {
      dataSource: projectData,
      count: projectData.length,
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
              <V2Tabs items={[{ key: '1', label: '筹建项目管理' }]} />
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
      <ProjectDrawer open={open} setOpen={setOpen} curInfo={curInfo} />
      <ChooseUserModal visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default Project;
