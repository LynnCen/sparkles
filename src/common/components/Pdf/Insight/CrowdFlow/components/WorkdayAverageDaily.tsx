import { FC, useMemo } from 'react';
import { showTargetChart } from '@/common/utils/ways';
import Exponent from './Exponent';
import Sex from './Sex';
import EducationAge from './EducationAge';
import MarriageIndustry from './MarriageIndustry';
import ConsumptionHousingPrice from './ConsumptionHousingPrice';
import Preference from './Preference';

const WorkdayAverageDaily: FC<any> = ({
  info,
  isIntegration

}) => {
  const flowHourData = useMemo(() => (info.workdayFlowHour || []), [info]);
  const sexData = useMemo(() => (info.workdaySex || []), [info]);
  const educationData = useMemo(() => (info.workdayEducation || []), [info]);
  const ageData = useMemo(() => (info.workdayAge || []), [info]);
  const consumptionData = useMemo(() => (info.workdayConsumption || []), [info]);
  const housePriceData = useMemo(() => (info.workdayHousePrice || []), [info]);
  const marriedData = useMemo(() => (info.workdayMarried || []), [info]);
  const carData = useMemo(() => (info.workdayCar || []), [info]);
  const childrenAgeData = useMemo(() => (info.workdayChildrenAge || []), [info]);
  const industryData = useMemo(() => (info.workdayIndustry || []), [info]);
  const visitingData = useMemo(() => (info.workdayVisiting || []), [info]);
  const appData = useMemo(() => (info.workdayApp || []), [info]);
  // const [state, setState] = useState<>();

  // 客流指数
  const showHour = useMemo(() => {
    return showTargetChart(flowHourData);
  }, [flowHourData]);

  // 男女比例
  const showSex = useMemo(() => {
    return showTargetChart(sexData);
  }, [sexData]);

  // 学历占比
  const showEducation = useMemo(() => {
    return showTargetChart(educationData);
  }, [educationData]);

  // 年龄分布
  const showAge = useMemo(() => {
    return showTargetChart(ageData);
  }, [ageData]);

  // 消费水平
  const showConsumption = useMemo(() => {
    return showTargetChart(consumptionData);
  }, [consumptionData]);
  // 社区房价
  const showHousePrice = useMemo(() => {
    return showTargetChart(housePriceData);
  }, [housePriceData]);
  // 婚姻
  const showMarriage = useMemo(() => {
    return showTargetChart(marriedData) || showTargetChart(childrenAgeData);
  }, [marriedData, childrenAgeData]);
  // 行业
  const showIndustry = useMemo(() => {
    return showTargetChart(industryData);
  }, [industryData]);
  // 到访偏好
  const showVisiting = useMemo(() => {
    return showTargetChart(visitingData);
  }, [visitingData]);
  // 行业
  const showApp = useMemo(() => {
    return showTargetChart(appData);
  }, [appData]);


  return (
    <>
      {
        showHour ? <Exponent typeName='工作日日均' flowHour={flowHourData} isIntegration={isIntegration}/> : null
      }
      {
        showSex ? <Sex typeName='工作日日均' sex={sexData} isIntegration={isIntegration}/> : null
      }
      {
        showEducation || showAge ? <EducationAge
          typeName='工作日日均'
          education={educationData}
          age={ageData}
          showEducation={showEducation}
          showAge={showAge}
          isIntegration={isIntegration}/>
          : null }
      {
        showMarriage || showIndustry
          ? <MarriageIndustry
            typeName='工作日日均'
            showMarriage={showMarriage}
            showIndustry={showIndustry}
            married={marriedData}
            car={carData}
            childrenAge={childrenAgeData}
            industry={industryData}
            isIntegration={isIntegration}/>
          : null
      }
      {
        showConsumption || showHousePrice ? <ConsumptionHousingPrice
          typeName='工作日日均'
          consumption={consumptionData}
          housePrice={housePriceData}
          showConsumption={showConsumption}
          showHousePrice={showHousePrice}
          isIntegration={isIntegration}/>
          : null }
      {
        showVisiting || showApp
          ? <Preference
            typeName='工作日日均'
            showVisiting={showVisiting}
            showApp={showApp}
            visiting={visitingData}
            app={appData}
            isIntegration={isIntegration}/>
          : null
      }
    </>
  );
};

export default WorkdayAverageDaily;
