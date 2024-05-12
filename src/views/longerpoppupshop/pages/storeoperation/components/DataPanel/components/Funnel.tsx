import { FC, useEffect, useMemo, useState } from 'react';
import { carHomeFunnel } from '@/common/api/carhome';
import { deepCopy, isArray } from '@lhb/func';
import styles from '../../../entry.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import FunnelItem from './FunnelItem';

const Funnel: FC<any> = ({ searchParams, cityId, funnelTitle }) => {
  const [funnelData, setFunnelData] = useState<any>(null);
  useEffect(() => {
    const { battles } = searchParams;
    if (!(isArray(battles) && battles.length)) return;

    getFunnelData(cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, cityId]);

  // useEffect(() => {
  //   // if (!cityId) return;
  //   getFunnelData(cityId);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cityId]);

  const getFunnelData = async (cityId?: number) => {
    const params = deepCopy(searchParams);
    if (cityId) {
      params.cityIds = [cityId];
    }
    const res = await carHomeFunnel(params);
    setFunnelData(res);
  };
  /**
   * name 漏斗展示的名词
   * cost 单位成本
   * count 人数
   * countRatio 人数相较于全国
   * ratio 转化率
   * nationwideRatio 转化率相较于全国
   * leftBg 左侧背景色
   * rightBg 右侧背景色
   */
  // 过店数据
  const passbyData = useMemo(() => {
    const { passbyCost, passby, passbyCostCompare } = funnelData || {};
    return {
      name: '过店',
      cost: passbyCost,
      count: passby,
      countRatio: passbyCostCompare,
      leftBg: 'rgba(0,117,255,0.03)',
      rightBg: '#006AFF',
      width: '120px', // TODO
      borderWidth: '10px',
      textLeft: '60px',
    };
  }, [funnelData]);
  // 进店数据
  const indoorData = useMemo(() => {
    const { indoor, indoorRate, indoorRateCompare, indoorCost, indoorCostCompare } = funnelData || {};
    return {
      name: '进店',
      cost: indoorCost,
      count: indoor,
      countRatio: indoorCostCompare,
      ratio: indoorRate,
      ratioName: '进店率',
      nationwideRatio: indoorRateCompare,
      leftBg: 'rgba(34,171,255,0.03)',
      rightBg: '#22ABFF',
      iconHref: 'icona-ic_shouyejindianlv',
      width: '110px', // TODO
      borderWidth: '16px',
      textLeft: '55px',
    };
  }, [funnelData]);
  // 留资数据
  const stayInfoData = useMemo(() => {
    const { stayInfo, stayInfoCost, stayInfoRate, stayInfoRateCompare, stayInfoCostCompare } = funnelData || {};
    return {
      name: '意向',
      cost: stayInfoCost,
      count: stayInfo,
      countRatio: stayInfoCostCompare,
      ratio: stayInfoRate,
      ratioName: '意向率',
      nationwideRatio: stayInfoRateCompare,
      leftBg: 'rgba(206,119,255, 0.04)',
      rightBg: '#B855F1',
      iconHref: 'icona-ic_shouyeshijiagoumailiuzilv',
      width: '95px', // TODO
      borderWidth: '22px',
      textLeft: '48px',
    };
  }, [funnelData]);
  // 试驾数据
  const testDriveData = useMemo(() => {
    const { testDrive, testDriveRate, testDriveRateCompare, testDriveCost, testDriveCostCompare } = funnelData || {};
    return {
      name: '购买',
      cost: testDriveCost,
      count: testDrive,
      countRatio: testDriveCostCompare,
      ratio: testDriveRate,
      ratioName: '购买率',
      nationwideRatio: testDriveRateCompare,
      leftBg: 'rgba(255,134,29,0.03)',
      rightBg: '#FEA253',
      iconHref: 'icona-ic_shouyeshijialv',
      width: '72px', // TODO
      borderWidth: '20px',
      textLeft: '36px',
    };
  }, [funnelData]);
  // 大定数据
  const orderData = useMemo(() => {
    const { order, orderCost, orderRate, orderRateCompare, orderCostCompare } = funnelData || {};
    return {
      name: '复购',
      cost: orderCost,
      count: order,
      countRatio: orderCostCompare,
      ratio: orderRate,
      ratioName: '复购率',
      nationwideRatio: orderRateCompare,
      leftBg: 'rgba(255,80,149,0.05)',
      rightBg: '#FF7C98',
      iconHref: 'icona-ic_shouyeshijiagoumailv',
      width: '50px', // TODO
      borderWidth: '17px',
      textLeft: '25px',
    };
  }, [funnelData]);

  return (
    <>
      {funnelData ? (
        <>
          <div className={styles.funnelCon}>
            <TitleTips name={`${funnelTitle}门店转换漏斗`} showTips={false} className={styles.titleTips} />
            <div className='ml-12'>
              <FunnelItem isFirst data={passbyData} />
              <FunnelItem data={indoorData} />
              <FunnelItem data={stayInfoData} />
              <FunnelItem data={testDriveData} />
              <FunnelItem data={orderData} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Funnel;
