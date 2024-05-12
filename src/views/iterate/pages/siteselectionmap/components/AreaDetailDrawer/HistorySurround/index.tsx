/**
 * @Description 商圈详情-历史经营门店周边信息
 * 整个文件夹已废弃
 */

import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
// import cs from 'classnames';
import { isArray } from '@lhb/func';
import V2Tabs from '@/common/components/Data/V2Tabs';
import Category from './Category';
import cs from 'classnames';

/**
 * @description category的poi个数统计
 */
interface CategoryCount {
  categoryId: number;
  pointNum: number;
}

const Surround: FC<any> = ({
  detail,
}) => {

  const [tabs, setTabs] = useState<any[]>([]);
  const [tabActive, setTabActive] = useState<string>('0');
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);

  /**
   * @description 更新各category tab的统计数
   */
  useEffect(() => {
    if (!isArray(categoryCounts)) return;
    const tmpTabs: any[] = [];
    categoryCounts.map((tb: any, index) => {
      tmpTabs.push({
        key: `${index}`,
        name: tb.name,
        label: `${tb.name} ${tb.poiNum || ''}`
      });
    });
    setTabs(tmpTabs);
  }, [categoryCounts]);

  return (
    <div className={styles.surround}>

      <div className={cs(styles.surroundContainer)}>
        <V2Tabs
          items={tabs}
          activeKey={tabActive}
          onChange={(active) => setTabActive(active)}
          className={styles.surroundTabs}
        />
        <div className='mt-12'>
          <Category
            lat={detail?.lat}
            lng={detail?.lng}
            parentTabActive={tabActive}
            centerName={detail?.areaName}
            centerAddress={detail?.centerAddress}
            setCategoryCounts={setCategoryCounts}
          />
        </div>
      </div>

    </div>

  );
};

export default Surround;
