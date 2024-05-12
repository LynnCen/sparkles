import IconFont from '@/common/components/IconFont';
import { Checkbox } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import cs from 'classnames';
import { CITY_LEVEL, DISTRICT_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { storeTree } from '@/common/api/selection';
import { dispatchNavigate } from '@/common/document-event/dispatch';
const Left:FC<any> = ({
  setCheckList,
  level,
  city
}) => {
  const [data, setData] = useState<any>([]);

  const getTreeAndNum = async () => {
    const params: any = {
      type: 2 // 汽车行业的门店地图
    };
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
    setData(res);
  };
  useEffect(() => {
    getTreeAndNum();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, city?.citycode]);

  const onCheckStatus = (val) => {
    setCheckList(val);
  };
  return (
    <div className={styles.leftCon}>
      <div>
        <IconFont
          iconHref='iconmendian'
          className='mr-8'
        />
        品牌网店分布
      </div>

      <div className='mt-5'>
        <Checkbox.Group onChange={onCheckStatus}>
          {data.map(item => item.type === 1 ? <div key={item.id}>
            <Checkbox value={item.id}><IconFont style={{ color: item.color }} iconHref={item.icon} /> {item.name} | {item.count}</Checkbox>
          </div> : null)}
        </Checkbox.Group>
      </div>

      <div
        className={cs(styles.bottom, 'c-006 ct mt-12')}
        onClick={() => dispatchNavigate('/car/flow')}
      >
    查看门店信息
      </div>
    </div>
  );
};
export default Left;
