/**
 * @Description 城市概况
 */
import styles from './index.module.less';
import DetailItem from './DetailItem';
import V2Title from '@/common/components/Feedback/V2Title';
import { RightOutlined } from '@ant-design/icons';
import DistrictModal from './DistrictModal';
import { useEffect, useState } from 'react';
import { post } from '@/common/request';
import { Spin } from 'antd';
import cs from 'classnames';


const DistrictOverview = ({ cityId }: any) => {
  /* status */
  const [detail, setDetail] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  /* hooks */
  useEffect(() => {
    if (cityId) {
      getDistrictDetail();
    }
  }, [cityId]);

  /* methods */
  const getDistrictDetail = () => {
    setLoading(true);
    // https://yapi.lanhanba.com/project/511/interface/api/56972
    post('/city/district/list', { id: cityId }).then((res) => {
      setDetail([...res]);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className={styles.districtOverview}>
      <Spin spinning={loading}>
        { !!detail.length && <>
          <div className={styles.districtOverviewContent}>
            { !!detail.length && detail.map((item, index) => {
              return <div key={index}>
                <V2Title type='H2' text={item.districtName} divider className={cs(styles.titleFamily, 'mb-10', index > 0 && 'mt-12')} />
                {/* <DetailItem title='户籍人口数' value={item.householdPopulation ? `${item.householdPopulation} 万人` : '-'} /> */}
                <DetailItem title='行政区住房均价' value={item.avgHousePrice ? `${item.avgHousePrice} 元` : '-'} />
                <DetailItem title='常住人口数｜占比' value={item.population ? `${item.population} 万人｜${item.populationRate}%` : '-'} />
                <DetailItem title='行政区GDP｜占比' value={item.gdp ? `${item.gdp} 亿元｜${item.gdpRate}%` : '-'} />
              </div>;
            }) }
          </div>
          <div className={styles.footerBtn} onClick={() => setOpen(true)}>行政区信息对比 <RightOutlined /></div>
        </> }
      </Spin>
      <DistrictModal
        open={open}
        setOpen={setOpen}
        data={detail}
      />
    </div>
  );
};

export default DistrictOverview;
