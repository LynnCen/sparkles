import { FC, useMemo } from 'react';
import { showTargetChart } from '@/common/utils/ways';
import styles from '../entry.module.less';
import Overview from './components/Overview';
import Catering from './components/Catering';
import Shopping from './components/Shopping';
import Agency from './components/Agency';
import LeisureService from './components/LeisureService';
import Catalog from '../Catalog';

const Business: FC<any> = ({
  name,
  detailInfo,
  isIntegration
}) => {
  const info = useMemo(() => (detailInfo?.situation || {}), [detailInfo]);
  const cateringData = useMemo(() => (info.catering || []), [info]);
  const shoppingData = useMemo(() => (info.shopping || []), [info]);
  const mallList = useMemo(() => (info.mall || []), [info]);
  const agencyData = useMemo(() => (info.agency || []), [info]);
  const schoolList = useMemo(() => (info.schoolList || []), [info]);
  const hospitalList = useMemo(() => (info.hospitalList || []), [info]);
  const leisureData = useMemo(() => (info.leisure || []), [info]);
  const serviceData = useMemo(() => (info.service || []), [info]);

  const showCateringData = useMemo(() => {
    return showTargetChart(cateringData);
  }, [cateringData]);

  const showLeisureService = useMemo(() => {
    return showTargetChart(leisureData) || showTargetChart(serviceData);
  }, [leisureData, serviceData]);

  return (
    <div className={styles.businessCon}>
      <Catalog detailInfo={detailInfo} name={name} pageIndex={3}/>
      <Overview info={info} detailInfo={detailInfo} isIntegration={isIntegration}/>
      {
        showCateringData && <Catering catering={cateringData} isIntegration={isIntegration}/>
      }
      <Shopping
        shopping={shoppingData}
        mallList={mallList}
        type={detailInfo?.report?.type}
        isIntegration={isIntegration}
      />
      <Agency
        agency={agencyData}
        schoolList={schoolList}
        hospitalList={hospitalList}
        type={detailInfo?.report?.type}
        isIntegration={isIntegration}/>
      {
        showLeisureService &&
        <LeisureService
          leisure={leisureData}
          service={serviceData}
          isIntegration={isIntegration}
        />
      }
    </div>
  );
};

export default Business;
