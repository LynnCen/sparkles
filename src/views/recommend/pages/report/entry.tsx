import { FC, useState } from 'react';
import { delObjEmptyProVal } from '@/common/utils/ways';
import styles from './entry.module.less';
import Search from './components/Search';
import Table from './components/Table';
import { useMethods } from '@lhb/hook';
import { get } from '@/common/request';
import dayjs from 'dayjs';

const Report: FC<any> = () => {
  const [searchParams, setSearchParams] = useState<any>({
    cityId: '',
    provinceId: '',
    districtId: '',
    modelId: '',
    createDate: '',
    status: '',
    creatorId: ''
  });
  // methods
  const { loadData, searchChange, onSearch } = useMethods({
    loadData: async (params: any) => {
      const searchObj = delObjEmptyProVal({ ...searchParams, ...params });
      const { objectList, totalNum } = await get('/shop/report/list', searchObj, {
        isMock: false,
        mockId: 331,
        mockSuffix: '/api',
        needHint: true
      });
      return {
        dataSource: objectList || [],
        count: totalNum,
      };
    },
    searchChange: (fieldsValue: Record<string, any>) => {
      const { pcdIds, createDate } = fieldsValue || {};
      const params: any = {
        cityId: '',
        provinceId: '',
        districtId: '',
        modelId: '',
        createDate: '',
        status: '',
        creatorId: ''
      };
      Object.assign(params, fieldsValue);
      delete params.pcdIds;
      if (Array.isArray(pcdIds) && pcdIds.length) {
        params.provinceId = pcdIds[0];
        params.cityId = pcdIds[1];
        pcdIds[2] && (params.districtId = pcdIds[2]);
      }
      if (createDate) {
        params.createDate = dayjs(createDate).format('YYYY-MM-DD');
      }
      setSearchParams(params);
    },
    onSearch: () => {
      setSearchParams({ ...searchParams });
    }
  });

  return (
    <div className={styles.container}>
      <Search change={searchChange} />
      <Table
        loadData={loadData}
        onSearch={onSearch}
        searchParams={searchParams} />
    </div>
  );
};

export default Report;
