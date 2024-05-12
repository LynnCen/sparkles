/**
 * @Description 单品牌数据--全国排名
 */

import { getBrandRank } from '@/common/api/recommend';
import { isArray } from '@lhb/func';
import { Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
import { rankIcon } from '@/common/enums/options';
import { mapLevel } from '../../../ts-config';
const title = {
  [mapLevel.COUNTRY_LEVEL]: {
    rate: '全国占比',
    area: '省份'
  },
  [mapLevel.PROVINCE_LEVEL]: {
    rate: '全省占比',
    area: '城市'
  },
  [mapLevel.CITY_LEVEL]: {
    rate: '全市占比',
    area: '区域名称'
  },
};
const BrandTable:FC<any> = ({
  provinceId,
  selectedBrand,
  currentMapLevel,
  brandIds,
  city,
  cityTypes,
  allAreaInfo,
  curAdcodeRef
}) => {
  const [data, setData] = useState<any>([]);

  const getData = async() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      setData([]);
      return;
    };
    let params:any = {
      brandIds: brandIds,
      cityTypeIds: cityTypes
    };
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL) {
      const provinceId = allAreaInfo.filter((item) => item.code === curAdcodeRef.current)[0]?.id;
      params = { ...params, provinceId: provinceId };
    }
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      params = { ...params, provinceId: city?.provinceId, cityId: city?.id };
    }
    const data = await getBrandRank(params);
    if (isArray(data) && data.length) {
      data[0].areaCoverList.map((item) => {
        item.key = item.code;
      });
      setData(data[0]?.areaCoverList || []);
    } else {
      setData([]);
    }
  };
  useEffect(() => {
    console.log('执行了', cityTypes);

    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIds, currentMapLevel, provinceId, selectedBrand, cityTypes, city?.id]);
  const columns = [
    {
      title: '排名',
      render: (text, record, index) => {
        if (index <= 2) {
          return <img src={rankIcon[index]} style={{
            width: '24px',
            height: '24px'
          }}/>;
        } else {
          return <span className={styles.rankIndex}>
            {index + 1}
          </span>;
        }

      },
    },
    {
      title: '门店数',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: title[currentMapLevel].area,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: title[currentMapLevel].rate,
      key: 'rate',
      dataIndex: 'rate',
    },
  ];
  return (<div>
    <Table
      sticky={true}
      pagination={false}
      columns={columns}
      dataSource={data}
      className={styles.tableInfo}
      rowKey='code'
    />
  </div>);
};
export default BrandTable;
