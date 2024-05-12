import { FC, useEffect, useState } from 'react';
import styles from '../entry.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import FormSearch from '@/common/components/Form/SearchForm';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { get } from '@/common/request';

const FilterFields: FC<any> = ({ onSearch, form }) => {
  const [devDptOptions, setDevDptOptions] = useState<any>([]);

  const loadOptions = async () => {
    // https://yapi.lanhanba.com/project/497/interface/api/51463
    const result: any = await get(
      '/yn/franchisee/group/list',
      {},
      {
        isMock: false,
        mockId: 497,
        mockSuffix: '/api',
        isZeus: true
      }
    );
    setDevDptOptions(result || []);

    const initParams = { groupId: 0 };
    form.setFieldsValue(initParams);
    onSearch(initParams);
  };

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.filterFieldsCon}>
      <TitleTips name='显示数据范围' showTips={false} className={styles.titleTips} />
      <FormSearch
        form={form}
        labelLength={4}
        showResetBtn={false}
        onSearch={(values) => onSearch(values)}
        className={styles.searchFormCon}
      >
        <FormSelect
          label='区域'
          name='groupId'
          options={devDptOptions}
          config={{ fieldNames: { label: 'groupName', value: 'groupId' } }}
        />
        <FormRangePicker
          label='日期'
          name='openingDate'
          config={{
            picker: 'month',
          }}
        />
      </FormSearch>
    </div>
  );
};

export default FilterFields;
