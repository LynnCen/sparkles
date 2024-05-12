import { isArray } from '@lhb/func';
import {
  FC,
  useEffect,
  // useEffect,
  // useMemo,
  useState,
} from 'react';
import styles from '../../entry.module.less';
import Funnel from './components/Funnel';
import Map from './components/Map';

/**
 * 逻辑说明
 * 默认展示选择的营销战役的相关数据，点击地图的城市时，左侧的漏斗做对应的改变
 */
const DataPanel: FC<any> = ({
  battleOptions,
  searchParams,
  funnelTitle,
  setFunnelTitle
}) => {
  const [cityId, setCityId] = useState<any>(0);

  useEffect(() => {
    if (!(isArray(battleOptions) && battleOptions.length)) return;
    if (cityId === 0) {
      const tagetBattles = battleOptions.filter((battleItem) => searchParams?.battles.includes(battleItem.id));
      if (tagetBattles.length) {
        const totalCount = tagetBattles.reduce((prev, next) => prev + next.count, 0);
        setFunnelTitle(`全国${totalCount}家`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, battleOptions, searchParams?.battles]);
  return (
    <div className={styles.dataPanelCon}>
      <div className={styles.contentCon}>
        {/* 漏斗 */}
        <Funnel
          cityId={cityId}
          funnelTitle={funnelTitle}
          searchParams={searchParams}/>
        {/* 地图 */}
        <Map
          setCityId={setCityId}
          searchParams={searchParams}
          setFunnelTitle={setFunnelTitle}/>
      </div>
    </div>
  );
};

export default DataPanel;
