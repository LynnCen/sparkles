import { FC, useEffect, useState } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { storeSelection } from '@/common/api/flow';

const Search: FC<any> = ({ change }) => {
  const [selectionOption, setSelectionOption] = useState<any>({
    status: [],
    source: [],
    deviceStatus: []
  });

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = async () => {
    const optionData = await storeSelection();
    setSelectionOption(optionData);
  };

  return (
    <SearchForm
      onSearch={change}
      labelLength={5}
      isFooterButtonLine
      className='crowdStorehouseSearchCon'>
      <V2FormInput label='店铺名称' name='name'/>
      <V2FormInput label='租户简称' name='tenantName'/>
      <V2FormSelect
        label='摄像头品牌'
        name='source'
        options={selectionOption.source}
        config={{
          fieldNames: { label: 'name', value: 'code' }
        }}/>
      <V2FormSelect
        label='摄像头状态'
        name='deviceStatus'
        options={selectionOption.deviceStatus}
        config={{
          fieldNames: { label: 'name', value: 'id' }
        }}/>
      <V2FormSelect
        label='营运状态'
        name='status'
        options={selectionOption.status}
        config={{
          fieldNames: { label: 'name', value: 'id' }
        }}/>
    </SearchForm>
  );
};

export default Search;
