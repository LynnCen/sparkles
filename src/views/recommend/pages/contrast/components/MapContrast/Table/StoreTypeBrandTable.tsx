/**
 * @Description 单品牌数据--全国排名  有全部门店类型和具体门店类型两种table
 */

import { getBrandRank, getCompareBrandRank } from '@/common/api/recommend';
import { isArray, isNotEmptyAny } from '@lhb/func';
import { Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../index.module.less';
import { ALLTYPE, mapLevel } from '../../../ts-config';
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
const StoreTypeBrandTable:FC<any> = ({
  selectedBrand,
  currentMapLevel,
  brandIds,
  cityTypes,
  city,
  storeTypeSelected,
  allAreaInfo,
  curAdcodeRef
}) => {
  const [data, setData] = useState<any>([]);
  const [concreteTypeData, setConcreteTypeData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getData = async() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      setData([]);
      return;
    };
    let params:any = {
      brandIds: brandIds,
      cityTypeIds: cityTypes,
      isSearchShopType: true, // 此时一定是门店类型状态下
    };
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL) {
      const provinceId = allAreaInfo.filter((item) => item.code === curAdcodeRef.current)[0]?.id;
      params = { ...params, provinceId: provinceId };
    }
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      params = { ...params, provinceId: city?.provinceId, cityId: city?.id };
    }
    setIsLoading(true);
    const data = await getBrandRank(params);
    if (isArray(data) && data.length) {
      data[0]?.areaCoverList?.map((item) => {
        item.key = item.code;
        item.brandName = data[0]?.name;
      });

      setData(data?.[0]?.areaCoverList);
      console.log('123', data?.[0]?.areaCoverList);
    } else {
      setData([]);
    }
    setIsLoading(false);
  };
  // 获取具体门店类型下面的数据
  const getConcreteTypeData = async() => {
    if (!(isArray(selectedBrand) && selectedBrand.length)) {
      setConcreteTypeData([]);
      return;
    };
    let params:any = {
      brandIds: brandIds,
      isSearchShopType: true, // 此时一定是门店类型状态下
      shopType: storeTypeSelected,
      cityTypeIds: cityTypes
    };
    if (currentMapLevel === mapLevel.PROVINCE_LEVEL) {
      const provinceId = allAreaInfo.filter((item) => item.code === curAdcodeRef.current)[0]?.id;
      params = { ...params, provinceId: provinceId };
    }
    if (currentMapLevel === mapLevel.CITY_LEVEL) {
      params = { ...params, provinceId: city?.provinceId, cityId: city?.id };
    }
    setIsLoading(true);
    const data = await getCompareBrandRank(params);
    if (isArray(data) && data.length) {
      data[0]?.areaCoverList?.map((item) => {
        item.key = item.code;
        item.brandName = data[0]?.name;
      });

      setConcreteTypeData(data?.[0]?.areaCoverList);
    } else {
      setConcreteTypeData([]);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    // 具体门店类型
    if (storeTypeSelected !== ALLTYPE) {
      getConcreteTypeData();
    } else {
      // 全部门店类型
      getData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandIds, cityTypes, currentMapLevel, selectedBrand, storeTypeSelected, city]);

  const allTypeColumns = [
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (val) => {
        console.log('val');
        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: '门店类型',
      dataIndex: 'name',
      key: 'name',
      render: (val) => {
        console.log('val-name', val);

        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: '门店总数',
      dataIndex: 'total',
      key: 'total',
      render: (val) => {
        console.log('val-name', val);

        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: title[currentMapLevel].rate,
      dataIndex: 'rate',
      key: 'rate',
      render: (val) => {
        console.log('val-name', val);

        return isNotEmptyAny(val) ? val : '-';
      }
    }
  ];
  const concreteTypeColumns = [
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      render: (val) => {
        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: title[currentMapLevel].area,
      dataIndex: 'name',
      key: 'name',
      render: (val) => {
        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: '门店类型',
      dataIndex: 'province',
      key: 'province',
      render: (val, record) => {
        return isArray(record?.shopTypeCoverList) ? record?.shopTypeCoverList[0]?.name : '';
      },
    },
    {
      title: '门店总数',
      dataIndex: 'total',
      key: 'total',
      render: (val) => {
        return isNotEmptyAny(val) ? val : '-';
      }
    },
    {
      title: title[currentMapLevel].rate,
      key: 'rate',
      dataIndex: 'rate',
      render: (val, record) => {
        return isArray(record?.shopTypeCoverList) ? record?.shopTypeCoverList[0]?.rate : '';
      },
    },
  ];
  return (<div>
    {
      isLoading
        ? <></>
        : <Table
          sticky={true}
          pagination={false}
          columns={storeTypeSelected === ALLTYPE ? allTypeColumns : concreteTypeColumns}
          dataSource={storeTypeSelected === ALLTYPE ? data : concreteTypeData}
          className={styles.tableInfo}
          rowKey='code'
        />
    }

  </div>);
};
export default StoreTypeBrandTable;
