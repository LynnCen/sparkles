import { FC, useMemo } from 'react';
import styles from '../entry.module.less';
import Overview from './components/Overview';
import BusSubway from './components/BusSubway';
import GasTrain from './components/GasTrain';
import Catalog from '../Catalog';

const Traffic: FC<any> = ({
  detailInfo,
  isIntegration
}) => {

  // const [state, setState] = useState<any>();
  const info = useMemo(() => (detailInfo?.traffic || {}), [detailInfo]);
  const busStopData = useMemo(() => (info.busStop || []), [info]); // 公交站
  const subwayStationData = useMemo(() => (info.subwayStation || []), [info]); // 地铁站
  const gasStationData = useMemo(() => (info.gasStation || []), [info]); // 加油站
  const trainStationData = useMemo(() => (info.trainStation || []), [info]); // 火车站

  const showBusSubway = useMemo(() => (busStopData.length || subwayStationData.length), [busStopData, subwayStationData]);
  const showGasTrain = useMemo(() => (gasStationData.length || trainStationData.length), [gasStationData, trainStationData]);
  return (
    <div className={styles.trafficCon}>
      <Catalog detailInfo={detailInfo} name={name} pageIndex={5}/>
      <Overview info={info} isIntegration={isIntegration}/>
      {
        showBusSubway
          ? <BusSubway
            radius={info?.complex?.radius}
            busStop={busStopData}
            subwayStation={subwayStationData}
            type={detailInfo?.report?.type}
            isIntegration={isIntegration}/>
          : null
      }
      {
        showGasTrain
          ? <GasTrain
            radius={info?.complex?.radius}
            gasStation={gasStationData}
            trainStation={trainStationData}
            type={detailInfo?.report?.type}
            isIntegration={isIntegration}/>
          : null
      }
    </div>
  );
};

export default Traffic;
