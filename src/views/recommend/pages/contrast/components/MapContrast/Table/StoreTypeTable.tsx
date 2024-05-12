/**
 * @Description 门店类型type下对应的table 有全部门店类型和具体门店类型两种table
 */
import { Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
import { getBrandRank } from '@/common/api/recommend';
import { isArray } from '@lhb/func';
import { ALLTYPE, mapLevel } from '../../../ts-config';
const title = {
  [mapLevel.COUNTRY_LEVEL]: '全国占比',
  [mapLevel.PROVINCE_LEVEL]: '全省占比',
  [mapLevel.CITY_LEVEL]: '全市占比',
};
const SynthesisTable:FC<any> = ({
  currentMapLevel,
  brandIds,
  city,
  selectedBrand,
  storeTypeSelected,
  allAreaInfo,
  cityTypes,
  curAdcodeRef
}) => {
  const [data, setData] = useState<any>(null);

  const getData = async() => {

    let params:any = {
      brandIds: brandIds,
      cityTypeIds: cityTypes,
      isSearchShopType: true, // 此时一定是门店类型状态下
    };
    if (storeTypeSelected !== ALLTYPE) {
      params = {
        ...params,
        shopType: storeTypeSelected
      };
    }
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
  }, [brandIds, cityTypes, currentMapLevel, selectedBrand, city?.id, storeTypeSelected]);
  const allTypeColumns = [
    {
      title: '品牌',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '门店类型TOP3',
      dataIndex: 'province',
      key: 'province',
      render: (val, record) => {
        return record?.areaCoverList?.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item?.name}</div>;
          } else {
            return '';
          }
        });
      },
    },
    {
      title: '门店总数',
      dataIndex: 'areaCoverCount',
      key: 'areaCoverCount',
      render: (val, record) => {
        return record?.areaCoverList?.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item?.total}</div>;
          } else {
            return '';
          }
        });
      },
    },
    {
      title: title[currentMapLevel],
      key: 'rate',
      dataIndex: 'rate',
      render: (val, record) => {
        return record?.areaCoverList?.map((item:any, index:number) => {
          if (index <= 2) {
            return <div>{item?.rate}</div>;
          } else {
            return '';
          }
        });
      },
    },
  ];
  // 具体类型
  const concreteTypeColumns = [
    {
      title: '品牌',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '门店类型',
      dataIndex: 'province',
      key: 'province',
      render: (val, record) => {
        return record?.areaCoverList?.[0]?.name;
      },
    },
    {
      title: '门店总数',
      dataIndex: 'areaCoverCount',
      key: 'areaCoverCount',
      render: (val, record) => {
        return record?.areaCoverList?.[0]?.total;
      },
    },
    {
      title: title[currentMapLevel],
      key: 'rate',
      dataIndex: 'rate',
      render: (val, record) => {
        return record?.areaCoverList?.[0]?.rate;
      },
    },
  ];
  return (<div>
    <Table
      sticky={true}
      pagination={false}
      columns={storeTypeSelected === ALLTYPE ? allTypeColumns : concreteTypeColumns}
      dataSource={data}
      className={styles.tableInfo}
      rowKey='id'
    />
  </div>);
};
export default SynthesisTable;

