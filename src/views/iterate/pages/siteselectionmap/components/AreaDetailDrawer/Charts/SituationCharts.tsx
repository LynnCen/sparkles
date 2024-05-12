import { FC, useMemo } from 'react';
import BarLineChart from './BarLineChart';
import { Col, Row } from 'antd';
import V2PieChart from '@/common/components/Charts/V2PieChart';
import { isArray, isNotEmpty, isNotEmptyAny } from '@lhb/func';
import V2BarChart from '@/common/components/Charts/V2BarChart';
import styles from './index.module.less';

const SituationCharts: FC<any> = ({
  districtName,
  detail
}) => {

  // TODO:

  // 门店业态分布数据
  const storeDistributionVOs = useMemo(() => {
    if (!detail?.storeDistributionVOs) {
      return [];
    }
    const data = isArray(detail?.storeDistributionVOs) && detail?.storeDistributionVOs.length ? detail?.storeDistributionVOs.map((item) => ({
      name: item.name,
      value: item.num
    })) : [];

    return data;
  }, [detail]);


  // 门店业态分布数据
  const fomatVOList = useMemo(() => {
    if (!detail?.fomatVOList) {
      return [];
    }
    const data = isArray(detail?.fomatVOList) && detail?.fomatVOList.length ? detail?.fomatVOList.filter((item) => (isNotEmptyAny(item.rateList))) : [];

    return data;
  }, [detail]);

  // 文案

  const houseText = useMemo(() => {
    if (!fomatVOList) {
      return [];
    }

    const houseData = fomatVOList.find((item) => item.commercialName === '住宅');

    const text = houseData.introduction;

    return text;
  }, [fomatVOList]);

  // 住宅房价数据
  const houseData = useMemo(() => {
    if (!fomatVOList) {
      return [];
    }

    const houseData = fomatVOList.find((item) => item.commercialName === '住宅');

    const data = isArray(houseData?.housePriceList) && houseData?.housePriceList.length
      ? houseData?.housePriceList
      : [];

    return data;
  }, [fomatVOList]);


  const houseData_xData = useMemo(() => {
    const arr = isArray(houseData) && houseData.length ? houseData.map((item) => item.name) : [];
    return arr;
  }, [houseData]);

  const houseData_yData = useMemo(() => {
    const y1 = isArray(houseData) && houseData.length ? houseData.map((item) => item.districtRate) : [];
    const y2 = isArray(houseData) && houseData.length ? houseData.map((item) => item.rate) : [];

    const bar = [{
      name: `${districtName}住宅价格分布`,
      unit: '%',
      data: y1,
    }];

    return [...bar, {
      name: `区域内住宅均价分布`,
      unit: '%',
      data: y2,
    }];
  }, [houseData]);

  return (
    <div>
      {isNotEmpty(houseText) ? <div className={styles.descCon}>
        {houseText || '-'}
      </div> : <></>}
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <V2BarChart
            title='住宅区房价分布'
            xAxisData={houseData_xData}
            seriesData={houseData_yData}
          />
        </Col>
        <Col span={12}>
          <V2PieChart
            title='门店分布业态'
            type='circle'
            seriesData={[{
              data: storeDistributionVOs,
            }]}
            config={{
            }}
            height={250}
          />
        </Col>
        {fomatVOList.length
          ? fomatVOList.map((item) =>
            <Col span={12}>
              <BarLineChart
                type={item?.commercialName}
                districtName={districtName}
                series={item?.rateList}
              />
            </Col>
          )
          : <></>}
      </Row>
    </div>
  );
};

export default SituationCharts;
