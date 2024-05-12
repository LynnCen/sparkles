import React, { useEffect, useState } from 'react';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import FormSearch from '@/common/components/Form/SearchForm';
import { FilterProps } from '../ts-config';
import styles from '../entry.module.less';
import { tenantSelectionByKey } from '@/common/api/location';
import { useMethods } from '@lhb/hook';

const Filters: React.FC<FilterProps> = ({ onSearch }) => {
  const [selection, setSelection] = useState<any>({
    certificateStatus: [],
    status: []
  });
  useEffect(() => {
    getSelection();
  }, []);
  const {
    getSelection
  } = useMethods({
    getSelection: async () => {
      const res = await tenantSelectionByKey({ keys: ['status', 'certificateStatus'] });
      setSelection(res);
    },
  });
  return (
    <FormSearch onSearch={onSearch} labelLength={4} className={styles.tenantForm}>
      <FormInput label='租户名称/团队名称' name='name' />
      <FormInput label='管理员' name='manager' placeholder='请输入姓名/手机号' />
      <FormSelect
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}
        label='状态'
        name='status'
        options={selection.status}
        allowClear />
      <FormSelect
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}
        label='认证状态'
        name='certificateStatus'
        options={selection.certificateStatus}
        allowClear />
    </FormSearch>
  );
};

export default Filters;
