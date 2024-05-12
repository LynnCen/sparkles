import { FC, useEffect, useState, useMemo } from 'react';
import { showTargetChart } from '@/common/utils/ways';
import { Table } from 'antd';
import cs from 'classnames';
import styles from '../../entry.module.less';
import Header from '../../Header';
import DoubleCircle from '../../DoubleCircle';
import PieEcharts from '../../PieEcharts';

const Agency: FC<any> = ({
  agency,
  schoolList,
  hospitalList,
  type,
  isIntegration

}) => {

  const [schoolColumns, setSchoolColumns] = useState<Array<any>>([]);
  const [hospitalColumns, setHospitalColumns] = useState<Array<any>>([]);

  useEffect(() => {
    if (type === 1) { // 圆形
      setSchoolColumns([
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: '学校名称', },
        { dataIndex: 'distance', title: '距离(m)' },
      ]);
      setHospitalColumns([
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: '医院名称' },
        { dataIndex: 'distance', title: '距离(m)' },
      ]);
    } else if (type === 2) { // 自定义区域
      setSchoolColumns([
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: '学校名称' },
      ]);
      setHospitalColumns([
        { dataIndex: 'index', title: '序号' },
        { dataIndex: 'name', title: '医院名称' }
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const targetStr = useMemo(() => {
    if (Array.isArray(agency) && agency.length) {
      return `${agency[0].name}相关的门店占比最高,${agency[0].name}氛围相对浓厚`;
    }
    return '';
  }, [agency]);

  const schoolRankingList = useMemo(() => {
    return schoolList.filter((item, index) => index < 5).map((item, index) => ({ ...item, index: index + 1 }));
  }, [schoolList]);

  const hospitalRankingList = useMemo(() => {
    return hospitalList.filter((item, index) => index < 5).map((item, index) => ({ ...item, index: index + 1 }));
  }, [hospitalList]);

  const showAgency = useMemo(() => {
    return showTargetChart(agency);
  }, [agency]);

  const showSchool = useMemo(() => {
    return showTargetChart(schoolRankingList);
  }, [schoolRankingList]);

  const showHospital = useMemo(() => {
    return showTargetChart(hospitalRankingList);
  }, [hospitalRankingList]);

  return (
    <div className={cs(styles.agencyCon, isIntegration && styles.integration)}>
      {
        showAgency || showSchool
          ? (<div className={styles.typeSchooldCon}>
            <Header
              hasIndex
              indexVal='03'
              name='商业氛围评估-机构业态'/>
            <div className={styles.flexCon}>
              {
                showAgency && (
                  <div className={styles.sectionLeftCon}>
                    <div className='fs-19 bold'>
                    机构类型
                    </div>
                    { targetStr && <div className={cs(styles.summaryStrCon, 'mb-10')}>{targetStr}</div>}
                    <PieEcharts
                      config={{
                        data: agency,
                        legendLeft: 'left',
                        legendTop: 12,
                        tooltipConfig: {
                          formatter: '{b}： {d}%',
                        }
                      }}
                      height='250px'/>
                  </div>
                )
              }

              { showSchool &&
              (
                <div className={styles.sectionRightCon}>
                  <div className='fs-19 bold'>
                    学校信息
                  </div>
                  <div className={styles.summaryStrCon}>
                    范围内学校是重要的潜在客源,对店铺的客群定位十分重要
                  </div>
                  <Table
                    rowKey='name'
                    dataSource={schoolRankingList}
                    columns={schoolColumns}
                    pagination={false}
                    className='mt-20'/>
                </div>
              )
              }
              <div className={styles.leftFooterDoubleCircle}>
                <DoubleCircle layout='vertical'/>
              </div>
            </div>
          </div>) : null
      }
      {
        showHospital && (
          <div className={styles.typeHospitalCon}>
            <Header
              hasIndex
              indexVal='03'
              name='商业氛围评估-机构业态'/>
            <div className={styles.aloneCenterCon}>
              <div className='fs-19 bold'>
                医院信息
              </div>
              <div className={styles.summaryStrCon}>
                范围内医院是重要的潜在客源,对店铺的客群定位十分重要
              </div>
              <Table
                rowKey='name'
                dataSource={hospitalRankingList}
                columns={hospitalColumns}
                pagination={false}
                className='mt-20'/>
            </div>
            <div className={styles.leftFooterDoubleCircle}>
              <DoubleCircle layout='vertical'/>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Agency;
