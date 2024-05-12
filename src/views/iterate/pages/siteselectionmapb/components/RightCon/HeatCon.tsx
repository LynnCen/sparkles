/**
 * @Description 热力图
 */
import IconFont from '@/common/components/IconFont';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Switch } from 'antd';
import { getHeatMapList } from '@/common/api/selection';
const HeatCon:FC<any> = ({
  mapIns,
  mapHelpfulInfo
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [liveOpen, setLiveOpen] = useState<boolean>(false);
  const [caterOpen, setCaterOpen] = useState<boolean>(false);

  const heatMapRef = useRef<any>(null);// 热力图

  const { city, district } = mapHelpfulInfo;

  const getHeatData = async() => {
    if (!liveOpen && !caterOpen) return;
    const data = await getHeatMapList({
      provinceId: city?.provinceId,
      cityId: city?.id,
      // districtId: district?.id,
      // 人群类型（1工作人群，2偏爱去餐饮的工作人口, 3餐饮热力, 4居住热力）
      crowdType: liveOpen ? 3 : 4,
    });
    heatMapRef.current?.show();
    heatMapRef.current?.setDataSet({ data, max: data[Math.floor(data?.length / 100)].count });
  };

  useEffect(() => {
    if (!mapIns) return;
    heatMapRef.current = new window.AMap.HeatMap(mapIns, {
      radius: 50,
      opacity: [0, 0.6],
    });
  }, [mapIns]);

  // 互斥
  useEffect(() => {
    if (liveOpen) {
      // 打开居住热力
      setCaterOpen(false);
    }
  }, [liveOpen]);
  // 互斥
  useEffect(() => {
    if (caterOpen) {
      // 打开餐饮热力
      setLiveOpen(false);
    }
  }, [caterOpen]);

  useEffect(() => {
    if (!liveOpen && !caterOpen) {
      heatMapRef.current?.hide();
    } else {
      getHeatData();
    }
  }, [liveOpen, caterOpen]);

  useEffect(() => {
    getHeatData();
  }, [district?.id]);

  return <div className={styles.skinToolCon}>
    <span
      className={styles.heatBtn}
      onClick={() => setOpen(state => !state)}>
      <span>热力图</span>
      <IconFont
        iconHref='pc-common-icon-a-iconarrow_down'
        className={cs(open ? styles.arrowIconUp : styles.arrowIcon, 'ml-8')}
      />
    </span>
    {
      open ? <div className={styles.heatCon}>
        <div className={styles.card}>
          <span className='mr-16'>居住</span>
          <Switch
            size='small'
            checked={liveOpen}
            onChange={() => setLiveOpen((state) => !state)}/>
        </div>
        <div className={styles.card}>
          <span className='mr-16'>餐饮</span>
          <Switch
            size='small'
            checked={caterOpen}
            onChange={() => setCaterOpen((state) => !state)}
          />
        </div>
      </div> : <></>
    }
  </div>;
};
export default HeatCon;
