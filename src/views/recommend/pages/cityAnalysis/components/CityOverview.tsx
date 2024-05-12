/**
 * @Description 城市概况
 */
import styles from './index.module.less';
import DetailItem from './DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import LazyLoad from '@/common/components/LazyLoad';
import DemographicChangesCharts from '@/common/components/business/SurroundDrawer/components/City/components/DemographicChangesCharts';
import GdpGrowthCharts from '@/common/components/business/SurroundDrawer/components/City/components/GdpGrowthCharts';
import { useEffect, useState } from 'react';
import { post } from '@/common/request';
import { beautifyThePrice } from '@lhb/func';
import { Spin } from 'antd';
import cs from 'classnames';


const CityOverview = ({ cityId }: any) => {
  /* status */
  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cityId) {
      getCityDetail();
    }
  }, [cityId]);

  /* methods */
  const getCityDetail = () => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/511/interface/api/56965
    post('/city/detail', { id: cityId }).then((res) => {
      setDetail(res);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className={styles.cityOverview}>
      <Spin spinning={loading}>
        { !!detail.name && <>
          <V2Title type='H2' text='城市基本信息' divider className={cs(styles.titleFamily, 'mb-12')} />
          <DetailItem title='城市名称' value={detail.name} />
          <DetailItem title='城市类别' value={detail.categoryName} />
          <DetailItem title='城市级别' value={detail.levelName} />
          <DetailItem title='城市面积' value={detail.area ? `${beautifyThePrice(detail.area, ',', 0, '')} km²` : '-'} />
          <DetailItem title='常住人口数' value={detail.population ? `${beautifyThePrice(detail.population, ',', 0, '')} 万人` : '-'} />
          <DetailItem title='城市GDP' value={detail.gdp ? `${beautifyThePrice(detail.gdp, ',', 2, '¥')} 亿元` : '-'} />
          <DetailItem title='人均GDP' value={detail.avgGdp ? `${beautifyThePrice(detail.avgGdp, ',', 2, '¥')} 万元` : '-'} />
          <DetailItem title='GDP增速' value={detail.gdpGrowthRate ? `${detail.gdpGrowthRate}%` : '-'} />
          <DetailItem title='商业情况' value={detail.shoppingCenterCount ? `${detail.shoppingCenterCount} 个购物中心` : '-'} />
          { detail.demographicChanges && <>
            <V2Title type='H2' text={`${detail.demographicChanges[0].data[0].name}-${detail.demographicChanges[0].data[detail.demographicChanges[0].data.length - 1].name}${detail.name}人口变化一览`} divider className={cs(styles.titleFamily, 'mt-20')} />
            <div className={styles.chartWrap}>
              <LazyLoad>
                <DemographicChangesCharts
                  data={detail.demographicChanges}
                  className={styles.charts}
                  showTitle={false}
                  gridConfig={{
                    top: '15%',
                    bottom: '0',
                  }}
                  legendConfig={{
                    top: '-1%'
                  }}
                />
              </LazyLoad>
            </div>
          </> }
          { detail.gdpGrowth && <>
            <V2Title type='H2' text={`${detail.gdpGrowth[0].data[0].name}-${detail.gdpGrowth[0].data[detail.gdpGrowth[0].data.length - 1].name}${detail.name}GDP及增速情况`} divider className={cs(styles.titleFamily, 'mt-20')} />
            <div className={styles.chartWrap}>
              <LazyLoad>
                <GdpGrowthCharts
                  data={detail.gdpGrowth}
                  className={styles.charts}
                  showTitle={false}
                  gridConfig={{
                    top: '15%',
                    bottom: '0',
                  }}
                  legendConfig={{
                    top: '-1%'
                  }}
                />
              </LazyLoad>
            </div>
          </> }
        </> }
      </Spin>
    </div>
  );
};

export default CityOverview;
