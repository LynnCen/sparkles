import React, { useEffect, useState } from 'react';
import FormSearch from '@/common/components/Form/SearchForm';
import { franchiseeTab } from '@/common/api/fishtogether';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Filter: React.FC<any> = ({
  onSearch,
  setCustomerStatusOptions
}) => {
  const [franchiseeOptions, setFranchiseeOptions] = useState<any>([]);

  const onFinish = (values) => {
    onSearch(values);
  };

  const loadOptions = async () => {
    const data: any = await franchiseeTab({});
    const options = Array.isArray(data) ? data.map(itm => ({ id: +itm.tab, name: itm.name })) : [];
    setFranchiseeOptions(options);
    setCustomerStatusOptions(options);
  };

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormSearch
      labelLength={3}
      onSearch={onFinish}
      labelAlign='right'
      colon={false}>
      <V2FormInput
        label='授权号'
        name='authNo'
        config={{ allowClear: true, maxLength: 32 }}
        placeholder='请输入授权号'/>
      <V2FormInput
        label='加盟商姓名'
        name='keyword'
        config={{ allowClear: true }}
        placeholder='请输入加盟商姓名或开发人员'/>
      <V2FormSelect
        label='当前状态'
        name='tab'
        options={franchiseeOptions}
        config={{
          allowClear: true,
          fieldNames: { label: 'name', value: 'id' }
        }} />
    </FormSearch>
  );
};

export default Filter;
