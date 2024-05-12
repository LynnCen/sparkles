/* 筛选条件 */
import { FC, useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { FilterProps } from '../ts-config';
import styles from './index.module.less';
import { debunce } from '@/views/tenant/pages/detail/components/OpsAccount';
import { get } from '@/common/request';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Filter: FC<FilterProps> = ({ onSearch }) => {
  const [options, setOptions] = useState<{label?: string, value?: number}[]>([]);
  const { clear }: any = debunce;
  // 搜索按钮
  const onSearchSelect = debunce(async (keyword: string) => {
    const result = await get('/position/search', { keyword }, {
      needHint: true,
      proxyApi: '/mirage'
    });
    const options = result.map(item => {
      const { id, name } = item;
      return {
        label: name,
        value: id
      };
    });
    setOptions(options);
  });


  useEffect(() => {
    return () => {
      clear?.();
    };
  }, []);

  useEffect(() => {
    onSearchSelect();
  }, []);

  return (
    <div className={styles.searchBox}>
      <FormSearch onSearch={(values) => onSearch && onSearch(values)}>
        <V2FormInput label='关键词' name='keyword' />
        <V2FormSelect
          label='岗位名称'
          name='positionId'
          options={options}
          config={{
            onSearch: onSearchSelect,
            filterOption: false,
            showSearch: true,
          }}
        />
      </FormSearch>
    </div>
  );
};

export default Filter;
