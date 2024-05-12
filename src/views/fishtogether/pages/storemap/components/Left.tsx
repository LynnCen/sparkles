import { Checkbox, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import { CITY_LEVEL, DISTRICT_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { storeTree } from '@/common/api/fishtogether';
const Left:FC<any> = ({
  setCheckList,
  level,
  city,
  setIsShow,
}) => {
  const [data, setData] = useState<any>([]);


  const getTreeAndNum = async () => {
    const params: any = {
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
        // const index = city.districtList.findIndex(e => e.name.includes(city.district));
        // index !== -1 && (params.districtId = city.districtList[index].id);
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
      <div className={styles.title}>
        {/* <IconFont
          iconHref='iconmendian'
          className='mr-8'
        /> */}
        品牌网点分布
      </div>
      <div className={styles.switchCon}>
        保护区范围显示：
        <Switch
          onChange={(val) => setIsShow(val)}
          checkedChildren='显示'
          unCheckedChildren='关闭'
          defaultChecked
          className={styles.switch}
        />
      </div>
      <div className={styles.checkBox}>
        <Checkbox.Group onChange={onCheckStatus}>

          {data.map(item => {
            const nameArr = item.name.split('-');
            return (
              <div key={item.id}>
                <Checkbox value={item.id}>
                  <img className={styles.areaImage} src={item.areaImage && item.areaImage !== '' ? item.areaImage : 'https://staticres.linhuiba.com/project-custom/locationpc/img_placeholder.png'} />
                  <span className={styles.interval}>
                    {nameArr[0]}
                  </span>
                  <span className={styles.interval}>
                    {nameArr[1]}
                  </span>
                  <span className='pl-4'>
                    {item.count}
                  </span>
                </Checkbox>
              </div>
            );
          })}
        </Checkbox.Group>
      </div>
    </div>
  );
};
export default Left;
