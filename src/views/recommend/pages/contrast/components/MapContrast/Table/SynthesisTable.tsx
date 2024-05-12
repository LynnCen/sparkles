/**
 * @Description 综合对比
 */

import { Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
import { getBrandRank } from '@/common/api/recommend';
import { isArray } from '@lhb/func';
import { mapLevel } from '../../../ts-config';
const title = {
  [mapLevel.COUNTRY_LEVEL]: {
    cover: '覆盖省份',
    rate: '全国占比',
    area: '主力省份'
  },
  [mapLevel.PROVINCE_LEVEL]: {
    cover: '覆盖该省城市',
    rate: '全省占比',
    area: '主力城市'
  },
  [mapLevel.CITY_LEVEL]: {
    cover: '覆盖该市行政区',
    rate: '全市占比',
    area: '主力行政区'
  },
};

const SynthesisTable:FC<any> = ({
  currentMapLevel,
  brandIds,
  city,
  selectedBrand,
  allAreaInfo,
  cityTypes,
  curAdcodeRef
}) => {
  const [data, setData] = useState<any>(null);

  const getData = async() => {

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
    setData(data);
  };

  useEffect(() => {
    if (!(isArray(brandIds) && brandIds.length)) {
      setData([]);
      return;
    };
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIds, cityTypes, currentMapLevel, selectedBrand, city?.id]);
  const columns = [
    {
      title: '品牌',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        return value ? record.shortName || value : '-';
      }
    },
    {
      title: title[currentMapLevel].cover,
      dataIndex: 'areaCoverCount',
      key: 'areaCoverCount',
      width: 140,
      render: (value, record) => {
        return value && record.areaTotalCount ? `${value}/${record.areaTotalCount}` : '-';
      }
    },
    {
      title: title[currentMapLevel].area,
      dataIndex: 'province',
      key: 'province',
      render: (val, record) => {
        return record.areaCoverList.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item.name}</div>;
          } else {
            return '';
          }
        });
      },
    },
    {
      title: '门店数量',
      dataIndex: 'province',
      key: 'total',
      render: (val, record) => {
        return record.areaCoverList.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item.total}</div>;
          } else {
            return '';
          }
        });
      },
    },
    {
      title: title[currentMapLevel].rate,
      key: 'rate',
      dataIndex: 'rate',
      render: (val, record) => {
        return record.areaCoverList.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item.rate}</div>;
          } else {
            return '';
          }
        });
      },
    },
  ];
  return (<div>
    <Table
      sticky={true}
      pagination={false}
      columns={columns}
      dataSource={data}
      className={styles.tableInfo}
      rowKey='id'
    />
  </div>);
};
export default SynthesisTable;
