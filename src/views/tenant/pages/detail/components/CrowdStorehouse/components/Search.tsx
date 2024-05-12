import { FC, useEffect, useState } from 'react';
import { CrowdStorehouseSearchProps } from '../../../ts-config';
import SearchForm from '@/common/components/Form/SearchForm';
import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
// import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import { storeSelection } from '@/common/api/flow';

const Search: FC<CrowdStorehouseSearchProps> = ({ change }) => {
  const [selectionOption, setSelectionOption] = useState<any>({
    status: [],
    source: [],
    deviceStatus: []
  });

  useEffect(() => {
    const getStatus = async () => {
      const result = await storeSelection();
      setSelectionOption(result);
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
      <FormSelect
        label='摄像头品牌'
        name='source'
        allowClear
        options={selectionOption.source}
        config={{
          fieldNames: { label: 'name', value: 'code' }
        }}/>
      <FormSelect
        label='摄像头状态'
        name='deviceStatus'
        allowClear
        options={selectionOption.deviceStatus}
        config={{
          fieldNames: { label: 'name', value: 'id' }
        }}/>
      <FormInput label='管理员' name='manager' allowClear placeholder='请输入管理员姓名' />
      <FormSelect
        label='营运状态'
        name='status'
        allowClear
        options={selectionOption.status}
        config={{ fieldNames: { label: 'name', value: 'id' } }}
      />
      <FormRangePicker
        label='营业日期'
        name='businessDate'
        config={{
          format: 'YYYY-MM-DD',
          style: {
            width: '100%'
          }
        }}/>
    </SearchForm>
  );
};

export default Search;
