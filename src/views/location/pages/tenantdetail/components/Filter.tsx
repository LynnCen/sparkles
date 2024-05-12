import React, { useEffect, useState } from 'react';
import FormSelect from '@/common/components/Form/FormSelect';
import FormSearch from '@/common/components/Form/SearchForm';
import styles from '../entry.module.less';
import { tenantSelectionByKey } from '@/common/api/location';
import { useMethods } from '@lhb/hook';
import FormRangePicker from '@/common/components/Form/FormRangePicker';

const Filters: React.FC<any> = ({ onSearch }) => {
  const [selection, setSelection] = useState<any>({
    tradeType: []
  });
  useEffect(() => {
    getSelection();
  }, []);
  const {
    getSelection
  } = useMethods({
    getSelection: async () => {
      const res = await tenantSelectionByKey({ keys: ['tradeType'] });
      setSelection(res);
    },
  });
  return (
    <FormSearch onSearch={onSearch} labelLength={4} className={styles.tenantForm}>
      <FormRangePicker
        label='交易时间'
        name='date'
        config={{
          style: { width: '100%' },
          allowClear: true
        }} />
      <FormSelect
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}
        label='交易类型'
        name='tradeType'
        options={selection.tradeType}
        allowClear />
    </FormSearch>
  );
};

export default Filters;
