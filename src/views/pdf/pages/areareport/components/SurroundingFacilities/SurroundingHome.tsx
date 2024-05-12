
import React, { useMemo } from 'react';
import { Col, Row } from 'antd';
import { CardLayout, PageLayout } from '../Layout';
import V2Title from '@/common/components/Feedback/V2Title';
import styles from './index.module.less';
import V2Table from '@/common/components/Data/V2Table';
import V2PieChart from '@/common/components/Charts/V2PieChart';
import { isNotEmptyAny } from '@lhb/func';
interface SurroundingHomeProps{
  [k:string]:any
}
const SurroundingMap = {
  '住宅': 'residence',
  '商业': 'commerce',
  '办公': 'office',
  '交通': 'traffic',
  '学校': 'school',
  '医疗': 'medical',
};
const SurroundingHome:React.FC<SurroundingHomeProps> = ({
  surroundingInfo,
  targetChildClass,
  homeData,
  // moduleMapCount
}) => {
  const defaultColumns = [
    { key: 'poiCount', title: 'POI数量' },
    { key: 'residence', title: '住宅' },
    { key: 'commerce', title: '商业' },
    { key: 'office', title: '办公' },
    { key: 'traffic', title: '交通' },
    { key: 'school', title: '学校' },
    { key: 'medical', title: '医疗' }
  ];
  const pieChartData = useMemo(() => {
    if (!surroundingInfo?.rateVOs) return [];
    return surroundingInfo?.rateVOs.map((item) => {
      return {
        value: item.rate,
        name: item.name
      };
    });
  }, [surroundingInfo]);

  const dataSource = useMemo(() => {
    const data = surroundingInfo?.distributionVOs?.map((item, index) => {
      const newItem = {
        id: index,
        poiCount: item.name,
      };
      item.children.forEach((item,) => {
        newItem[SurroundingMap[item.name]] = item.num;
      });
      return newItem;
    });
    return data;
  }, [surroundingInfo]);

  return <PageLayout
    logo={homeData?.tenantLogo}
    title='周边配套'
    // moduleCount={Number(moduleMapCount?.surroundingFacilities)}
    // totalPage={32}
    // currentPage={Number('04')}
    childClass={targetChildClass}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <V2Title divider type='H2' text='配套点评'/>
        <div className={styles.description}>{surroundingInfo?.introduction}</div>
      </Col>
      {
        isNotEmptyAny(dataSource) && <Col span={24}>
          <V2Title divider type='H2' text='聚客来源汇总' style={{ marginBottom: 16 }}/>
          <V2Table
            rowKey='id'
            type = 'easy'
            onFetch={() => ({
              dataSource
            })}
            defaultColumns={defaultColumns}
            pagination={false}
            hideColumnPlaceholder
          />
        </Col>
      }
      {
        isNotEmptyAny(pieChartData) && <Col span={24}>
          <CardLayout title='聚客来源占比'>
            <V2PieChart
              title=''
              type='circle'
              seriesData={[{
                data: pieChartData,
                unit: '%',
                animation: false,
              }]}
              height={260}
            />
          </CardLayout>
        </Col>
      }
    </Row>
  </PageLayout>;
};

export default SurroundingHome;
