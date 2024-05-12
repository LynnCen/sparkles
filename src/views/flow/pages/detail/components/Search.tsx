import { FC, useEffect, useState } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import { storeSelection } from '@/common/api/flow';

const Search: FC<any> = ({ change }) => {
  const [statusOptions, setStatusOptions] = useState<any>({
    status: [],
    source: [],
    deviceStatus: []
  });

  useEffect(() => {
    const getStatus = async () => {
      const result = await storeSelection();
      setStatusOptions(result);
    };
    getStatus();
  }, []);

  return (
    <SearchForm
      onSearch={change}
      labelLength={5}
      isFooterButtonLine
      className='crowdStorehouseSearchCon'>
      <FormInput
        label='店铺名称'
        name='name'
        allowClear
        placeholder='请输入店铺名称'/>
      <FormInput
        label='租户简称'
        name='shortName'
        allowClear
        placeholder='请输入租户简称'/>
      <FormSelect
        label='摄像头品牌'
        name='cameraType'
        options={statusOptions.source}
        config={{
          fieldNames: { label: 'name', value: 'code' }
        }}/>
      <FormSelect
        label='摄像头状态'
        name='cameraStatus'
        options={statusOptions.deviceStatus}
        config={{
          fieldNames: { label: 'name', value: 'id' }
        }}/>
      <FormSelect
        label='营运状态'
        name='operatingStatus'
        options={statusOptions.status}
        config={{
          fieldNames: { label: 'name', value: 'id' }
        }}/>
    </SearchForm>
  );
};

export default Search;
