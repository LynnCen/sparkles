import { Checkbox, Switch } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
// import cs from 'classnames';
import styles from '../entry.module.less';
import { CITY_LEVEL, DISTRICT_LEVEL, PROVINCE_LEVEL } from '@/common/components/AMap/ts-config';
import { storePointCountStandard } from '@/common/api/storemap';
import IconFont from '@/common/components/IconFont';

const Left:FC<any> = ({
  setCheckList,
  level,
  city,
  setIsShow,
}) => {
  // 数据源
  const [data, setData] = useState<any>([]);
  const firstRef = useRef<boolean>(true);
  // 获取复选框项
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
    const res = await storePointCountStandard({ ...params });
    if (firstRef.current) {
      setCheckList(res.map((item) => item.id));
    }
    firstRef.current = false;
    setData(res);
  };
  useEffect(() => {
    getTreeAndNum();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, city?.citycode]);

  const onCheckStatus = (val) => {
    setCheckList(val);
  };

  const formatCount = (count: number) => {
    if (!count) return 0;
    if (count < 10000) return count;
    return `${(count / 10000).toFixed(1)}w`;
  };
  return (
    <div className={styles.leftCon}>
      <div className={styles.title}>
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
        {
          data.length ? <Checkbox.Group onChange={onCheckStatus} defaultValue={data.map((item) => item.id)}>

            {data.map(item => {
              return (
                <div key={item.id} className='mt-10'>
                  <Checkbox value={item.id}>
                    {/* iconHref先写死，后期有动态配置的迭代 */}
                    <IconFont
                      iconHref='iconic_mendian'
                      style={{
                        color: item.color
                      }}
                    />
                    <span className={styles.inlineFlex}>
                      <span className='pl-4 fs-14'>{ item.name }</span>
                      <Tooltip
                        placement='top'
                        overlayInnerStyle={{
                          fontSize: '12px'
                        }}
                        title={item.comment || ''}>
                        <span>
                          <IconFont
                            iconHref='iconquestion-o'
                            className='fs-14 c-999' />
                        </span>
                      </Tooltip>
                    </span>
                    <span className='pl-4 c-bbc'>|</span>
                    <span className='pl-4'>
                      {formatCount(item.count)}
                    </span>
                  </Checkbox>
                </div>
              );
            })}
          </Checkbox.Group> : <></>
        }
      </div>
    </div>
  );
};
export default Left;
