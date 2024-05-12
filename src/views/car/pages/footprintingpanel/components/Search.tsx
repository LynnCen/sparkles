import { FC, useState, useEffect } from 'react';
import { Form } from 'antd';
import { footprintingManageSelection } from '@/common/api/footprinting';
import SearchForm from '@/common/components/Form/SearchForm';
import FormInputNumberRange from '@/common/components/Form/FormInputNumberRange';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import { refactorSelection } from '@/common/utils/ways';

const Search: FC<any> = ({ change }) => {
  const [form] = Form.useForm();

  const [selectionData, setSelectionData] = useState<any>({
    shopCategory: [],
    process: [],
    checkWay: [],
  });

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = async () => {
    const params = {
      keys: ['process', 'shopCategory', 'checkWay'],
    };
    const data = await footprintingManageSelection(params);
    setSelectionData(data);
  };

  return (
    <SearchForm labelLength={7} onSearch={change} form={form}>
      <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(selectionData.shopCategory)}/>
      <FormInputNumberRange label='工作日日均客流' min={0} max={10000000} name='aveFlowWeekday' addonAfter='人次' />
      <FormInputNumberRange label='节假日日均客流' min={0} max={10000000} name='aveFlowWeekend' addonAfter='人次' />
      <FormInputNumberRange label='平均CPM' min={0} max={10000000} name='cpm' addonAfter='元' />
    </SearchForm>
  );
};

export default Search;
