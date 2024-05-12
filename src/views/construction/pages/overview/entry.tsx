import { FC, useState } from 'react';
import styles from './entry.module.less';
import V2Table from '@/common/components/Data/V2Table';
import V2Container from '@/common/components/Data/V2Container';
import cs from 'classnames';
import { Typography } from 'antd';
import ProjectDrawer from '../project/components/ProjectDrawer';
import { projectData } from '../project/ts-config';

const { Link } = Typography;

const Construction: FC<any> = () => {
  const [mainHeight, setMainHeight] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const [curInfo, setCurInfo] = useState<any>(projectData[0]);
  const onClick = (record) => {
    setOpen(true);
    setCurInfo(record);
  };

  const renderConstructState = (value) => {
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
  };

  const defaultColumns = [
    { title: '序号', key: 'idx', width: 100, dragChecked: true },
    {
      title: '门店名称',
      key: 'name',
      width: 100,
      dragChecked: true,
      render: (text, record) => <Link onClick={() => onClick(record)}>{text}</Link>,
    },
    { title: '所属分公司', key: 'branchCompany', width: 100, dragChecked: true },
    {
      title: '筹建状态',
      key: 'constructState',
      width: 100,
      dragChecked: true,
      render: (value) => {
        return renderConstructState(value);
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
    { title: '当前进度', key: 'currentProgress', width: 100, dragChecked: true },
    { title: '负责人', key: 'personInCharge', width: 100, dragChecked: true },
    { title: '计划开业', key: 'planOpenDate', width: 100, dragChecked: true },
    { title: '交房日期', key: 'handoverDate', width: 100, dragChecked: true },
  ];

  const loadData = () => {
    const validData = projectData
      .filter((item) => Boolean(item?.personInCharge))
      .map((item, idx) => ({ ...item, idx: idx + 1 }));
    return {
      dataSource: validData,
      count: validData.length,
    };
  };

  return (
    <div>
      <V2Container
        className={cs(styles.container)}
        style={{ height: 'calc(100vh - 120px)' }}
        emitMainHeight={(h) => setMainHeight(h)}
        extraContent={{
          top: <div />,
        }}
      >
        <div className={styles.context}>
          <div className={styles.left}>
            <div className={styles.top}>
              <div className={styles.dataArea}>
                <div className={styles.dataCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/7.png'
                    width='100%'
                    height='100%'
                  />
                </div>
                <div className={styles.dataCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/6.png'
                    width='100%'
                    height='100%'
                  />
                </div>
                <div className={styles.dataCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/5.png'
                    width='100%'
                    height='100%'
                  />
                </div>
                <div className={styles.dataCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/4.png'
                    width='100%'
                    height='100%'
                  />
                </div>
              </div>

              <div className={styles.chartArea}>
                <div className={styles.chartCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/3.png'
                    width='100%'
                    height='100%'
                  />
                </div>
                <div className={styles.chartCard}>
                  <img
                    src='https://staticres.linhuiba.com/project-custom/locationpc/construction/2.png'
                    width='100%'
                    height='100%'
                  />
                </div>
              </div>
            </div>
            <div className={styles.table}>
              <V2Table
                onFetch={loadData}
                defaultColumns={defaultColumns}
                rowKey='id'
                hideColumnPlaceholder
                emptyRender
                tableSortModule='consoleConstructionOverview'
                // 64是分页模块的总大小， 42是table头部
                scroll={{ y: mainHeight - 450 }}
              />
            </div>
          </div>
          <div className={styles.right}>
            <img
              src='https://staticres.linhuiba.com/project-custom/locationpc/construction/1.png'
              width='100%'
              height='100%'
            />
          </div>
        </div>
      </V2Container>
      <ProjectDrawer open={open} setOpen={setOpen} curInfo={curInfo} />
    </div>
  );
};

export default Construction;
