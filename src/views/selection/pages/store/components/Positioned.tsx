import { FC, useEffect, useState } from 'react';

import cs from 'classnames';

import { Checkbox, Tabs } from 'antd';
import IconFont from '@/common/components/IconFont';
import ProvinceListForMap from '@/common/components/AMap/components/ProvinceListForMap';

import styles from '../entry.module.less';
import { useMethods } from '@lhb/hook';
import { storeTree } from '@/common/api/selection';
import { PROVINCE_LEVEL, CITY_LEVEL, DISTRICT_LEVEL } from '@/common/components/AMap/ts-config';

const Positioned: FC<{
  _mapIns?: any;
  level: number;
  city: any;
  setCheckList: Function;
}> = ({
  _mapIns,
  level,
  city,
  setCheckList
}) => {
  const [attribute, setAttribute] = useState<any>([]);
  const [statusList, setStatusList] = useState<any>([]);
  const [typeList, setTypeList] = useState<any>([]);
  useEffect(() => {
    getTreeAndNum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, city]);
  const {
    getTreeAndNum,
    onCheckStatus,
    onCheckType
  } = useMethods({
    getTreeAndNum: async () => {
      const params: any = {};
      switch (level) {
        case PROVINCE_LEVEL:
          params.provinceId = city.provinceId;
          break;
        case CITY_LEVEL:
          params.provinceId = city.provinceId;
          params.cityId = city.id;
          break;
        case DISTRICT_LEVEL:
          params.provinceId = city.provinceId;
          params.cityId = city.id;
          const index = city.districtList.findIndex(e => e.name.includes(city.district));
          index !== -1 && (params.districtId = city.districtList[index].id);
          break;
      }
      const res = await storeTree({ ...params });
      setAttribute(res);
    },
    onCheckStatus: (checkedValues) => {
      setStatusList(checkedValues);
      // 聚合两个类型结果
      setCheckList([...checkedValues, ...typeList]);
    },
    onCheckType: (checkedValues) => {
      setTypeList(checkedValues);
      setCheckList([...statusList, ...checkedValues]);
    }
  });
  return (<div className={cs(styles.positionedCon)}>
    <ProvinceListForMap
      _mapIns={_mapIns}
      city={city}
      level={level}
      className='mb-12 bg-fff' />
    <Tabs className='bg-fff pd-12 pt-6'>
      <Tabs.TabPane tab='店铺状态' key='type1'>
        <Checkbox.Group onChange={onCheckStatus}>
          {attribute.map(item => item.type === 1 ? <div key={item.id} className={styles.list}>
            <Checkbox value={item.id}><IconFont iconHref={item.icon} /> {item.name} | {item.count}</Checkbox>
          </div> : null)}
        </Checkbox.Group>
      </Tabs.TabPane>
      <Tabs.TabPane tab='店铺类型' key='type2'>
        <Checkbox.Group onChange={onCheckType}>
          {attribute.map(item => item.type === 2 ? <div key={item.id}>
            <Checkbox value={item.id}><IconFont style={{ color: item.color }} iconHref={item.icon} /> {item.name} | {item.count}</Checkbox>
          </div> : null)}
        </Checkbox.Group>
      </Tabs.TabPane>
    </Tabs>
  </div>);
};

export default Positioned;
