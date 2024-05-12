import { FC } from 'react';
import styles from './index.module.less';
import AnalysisCityMarket from './components/AnalysisCityMarket';
import AnalysisCompetitive from './components/AnalysisCompetitive';
import AnalysisBusinessClimate from './components/AnalysisBusinessClimate';
import PlaceAnalysisCustomer from './components/PlaceAnalysisCustomer';
import PlaceAnalysisTraffic from './components/PlaceAnalysisTraffic';
import Detail from './components/Detail';
import { TABS } from '../../ts-config';
import EnterBrand from './components/EnterBrand';


const AssessMain:FC<any> = ({
  data = {},
  detailData = {},
  tabActiveKey
}) => {

  return (
    <div className={styles.assessMain}>
      {/* 场地信息 */}
      {tabActiveKey === TABS.Place ? <Detail data={detailData} /> : null}
      {/* 竞争力分析 */}
      {tabActiveKey === TABS.AnalysisCompetitive ? <AnalysisCompetitive data={data?.placeAnalysisCompetitive}/> : null}
      {/* 城市市场评估 */}
      {tabActiveKey === TABS.CityMarketAssessment ? <AnalysisCityMarket data={data?.placeAnalysisCityMarket}/> : null}
      {/* 商业氛围评估 */}
      {tabActiveKey === TABS.AnalysisBusinessClimate ? <AnalysisBusinessClimate data={data?.placeAnalysisBusinessClimate}/> : null}
      {/* 客群客流评估 */}
      {tabActiveKey === TABS.PlaceAnalysisCustomer ? <PlaceAnalysisCustomer data={data?.placeAnalysisCustomer}/> : null}
      {/* 交通便利评估 */}
      {tabActiveKey === TABS.PlaceAnalysisTraffic ? <PlaceAnalysisTraffic data={data?.placeAnalysisTraffic}/> : null}
      {/* 入驻品牌 */}
      {tabActiveKey === TABS.EnterBrand ? <EnterBrand /> : null}
    </div>
  );
};
export default AssessMain;
