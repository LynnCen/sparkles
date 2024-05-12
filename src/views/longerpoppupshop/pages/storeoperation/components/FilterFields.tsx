import {
  FC,
  // useEffect,
  // useState,
} from 'react';
// import { carHomeSelections } from '@/common/api/carhome';
// import { isArray } from '@lhb/func';
import styles from '../entry.module.less';
import TitleTips from '@/common/components/business/TitleTips/TitleTips';
import FormSearch from '@/common/components/Form/SearchForm';
import FormSelect from '@/common/components/Form/FormSelect';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
// import FieldsDrawer from './FieldsDrawer';

const FilterFields: FC<any> = ({
  onSearch,
  battleOptions,
  // setFunnelTitle,
  form,
}) => {
  return (
    <div className={styles.filterFieldsCon}>
      <TitleTips
        name='显示数据范围'
        // showTips={false}
        showTips={true}
        className={styles.titleTips}
      />
      <FormSearch form={form} labelLength={4} showResetBtn={false} onSearch={(values) => onSearch(values)} className={styles.searchFormCon}>
        <FormSelect
          label='拓店任务'
          name='battles'
          options={battleOptions}
          config={{
            fieldNames: {
              label: 'name',
              value: 'name',
            },
            mode: 'multiple',
            maxTagCount: 1,
            // removeIcon: <></>
            // onChange: battleChange
          }}
        />
        <FormRangePicker label='开业时间' name='openingDate' />
      </FormSearch>
      {/* 侧边抽屉-数据筛选 */}
      {/* <FieldsDrawer
        open={visible}
        setopen={setVisible}/> */}
    </div>
  );
};

export default FilterFields;
