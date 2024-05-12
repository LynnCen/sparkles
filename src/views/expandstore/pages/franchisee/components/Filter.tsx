/**
 * @Description 加盟商 列表筛选项
 */

import { Form } from 'antd';
import { FC, useEffect, useState } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { getFranchiseeSelection } from '@/common/api/expandStore/franchisee';
import { isArray, refactorSelection } from '@lhb/func';

const Filter: FC<any> = ({
  onSearch,
  onFilterChanged,
}) => {
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = () => {
    getFranchiseeSelection({}).then(({ status }: any) => {
      isArray(status) && setStatuses(refactorSelection(status, { name: 'name', id: 'value' }));
    });
  };

  const handleSearch = (value: any) => {
    onSearch(value);
  };

  const handleValuesChange = (changedValues, allValues) => {
    onFilterChanged && onFilterChanged(allValues);
  };

  return (
    <SearchForm
      onOkText='搜索'
      form={form}
      labelLength={5}
      onSearch={handleSearch}
      onValuesChange={handleValuesChange}
    >
      <V2FormInput
        label='加盟商姓名'
        name='keyword'
        placeholder='请输入加盟商姓名/身份证号'
        maxLength={20}
      />
      <V2FormSelect
        label='加盟商状态'
        name='statuses'
        options={statuses}
        config={{
          mode: 'multiple',
          maxTagCount: 'responsive'
        }}
      />
    </SearchForm>
  );
};

export default Filter;
