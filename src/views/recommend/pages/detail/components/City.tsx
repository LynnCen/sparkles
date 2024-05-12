import { getModelReportCity } from '@/common/api/recommend';
import { valueFormat } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import React, { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';

const City: FC<any> = (id) => {
  const [information, setInformation] = useState<any>({});
  useEffect(() => {
    id && methods.getInformation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const methods = useMethods({
    getInformation: async () => {
      const res = await getModelReportCity(id);
      setInformation(res);
    },
  });
  return <div className={styles.city}>
    <div className={styles.lineBox}>
      <div><label>城市名称：</label>{valueFormat(information.name)}</div>
      <div><label>城市级别：</label>{valueFormat(information.levelName)}</div>
      <div><label>城市类别：</label>{valueFormat(information.categoryName)}</div>
    </div>
    <div className={styles.lineBox}>
      <div><label>城市GDP：</label>{valueFormat(information.gdp)}<span>亿元</span></div>
      <div><label>人均GDP：</label>{valueFormat(+information?.avgGdp?.toFixed(2))}<span>万元</span></div>
      <div><label>GDP增速：</label>{valueFormat(information.gdpGrowthRate)}%</div>
    </div>
    <div className={styles.lineBox}>
      <div><label>城市面积：</label>{valueFormat(information.area)}<span>km²</span></div>
      <div><label>常住人口数：</label>{valueFormat(information.population)}<span>万人</span></div>
      {/* <div><label>户籍人口数：</label>{valueFormat(information.residencePopulation)}<span>万人</span></div> */}
    </div>
  </div>;
};

export default React.memo(City);
