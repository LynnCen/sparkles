import { getAlternateDetail, getChancePoint, getChancePointDetail, getReportScore, getReserveStoreDetail } from '@/common/api/storemanage';
import V2Container from '@/common/components/Data/V2Container';
import { fixNumber } from '@/common/utils/ways';
import { urlParams } from '@lhb/func';
import { FC, useEffect, useState } from 'react';
import Table from './components/Table';
import styles from './entry.module.less';
const ScoreDetail: FC<any> = () => {
  const id = urlParams(location.search)?.id;
  const isChancepoint = urlParams(location.search)?.isChancepoint === 'true';
  const isAlternative = urlParams(location.search)?.isAlternative === 'true';
  // const isReserve = urlParams(location.search)?.isReserve;
  const [result, setResult] = useState<any>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);

  const getDetail = async(params) => {
    // 机会点用getChancePoint，其余用getReportScore（拓店调研报告）
    const url = isChancepoint ? getChancePoint : getReportScore;
    const val = await url(params);
    setTableInfo(val);
  };

  useEffect(() => {
    if (!id) return;
    const detailUrl = isChancepoint ? getChancePointDetail : (isAlternative ? getAlternateDetail : getReserveStoreDetail);
    detailUrl({ id: Number(id) }).then((val) => {
      const {
        shopInformation,
        mallInformation,
        engineCondition,
        surroundFacility,
        trafficOverview,
        flowInformation,
        takeawayAtmosphere,
        businessInformation,
        competeBrandOverview,
        earnEstimate,
      } = val || {};
      getDetail({
        shopInformation,
        mallInformation,
        engineCondition,
        surroundFacility,
        trafficOverview,
        flowInformation,
        takeawayAtmosphere,
        businessInformation,
        competeBrandOverview,
        earnEstimate
      });
      setResult(val);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <V2Container
      className={styles.container}
      style={{ height: 'calc(100vh - 80px)' }}
      emitMainHeight={(h) => setMainHeight(h)}
      extraContent={{
        top:
        <>
          <div className={styles.top}>
            {result?.chancePointName || result?.reportName }
          </div>
          <div className={styles.content}>
            <div className={styles.title}>
          评分解读
            </div>
            <div className={styles.scoreCon}>
              <span className={styles.scoreText}>综合得分</span>
              {tableInfo && <span className={styles.scoreNum}>{fixNumber(tableInfo?.shopScore)}分</span>}
            </div>
          </div>
        </>,
      }}>
      {tableInfo && <Table
        tableInfo={tableInfo}
        mainHeight={mainHeight}
      />}
    </V2Container>
  );
};

export default ScoreDetail;
