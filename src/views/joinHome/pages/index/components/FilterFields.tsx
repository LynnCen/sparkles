import { FC, } from 'react';
import styles from '../entry.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import FormSearch from '@/common/components/Form/SearchForm';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

const FilterFields: FC<any> = ({
  onSearch,
  form
}) => {

  const devDptOptions = [
    { value: 0, label: '全国' },
    { value: 1, label: '华东区' },
    { value: 2, label: '华南区' },
    { value: 3, label: '华中区' },
    { value: 4, label: '华北区' },
    { value: 5, label: '西南区' },
    { value: 6, label: '西北区' },
    { value: 7, label: '东北区' },
  ];

  return (
    <div className={styles.filterFieldsCon}>
      <TitleTips
        name='显示数据范围'
        showTips={false}
        className={styles.titleTips}/>
      <FormSearch
        form={form}
        labelLength={4}
        showResetBtn={false}
        onSearch={(values) => onSearch(values)}
        className={styles.searchFormCon}
        initialValues={{
          devDpt: 0, // 默认全国
        }}>
        <FormSelect
          label='区域'
          name='devDpt'
          options={devDptOptions}
        />
        <FormRangePicker
          label='开业时间'
          name='openingDate' />
      </FormSearch>
    </div>
  );
};

export default FilterFields;
