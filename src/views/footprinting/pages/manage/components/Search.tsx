import { FC, useState, useEffect } from 'react';
import { Form } from 'antd';
import SearchForm from '@/common/components/Form/SearchForm';
import FormBrands from '@/common/components/FormBusiness/FormBrands';
import FormPlaces from '@/common/components/FormBusiness/FormPlaces';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import V2FormDatePicker from '@/common/components/Form/V2FormDatePicker/V2FormDatePicker';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import { industryList, placeCategoryList } from '@/common/api/common';
import { footprintingManageSelection } from '@/common/api/footprinting';
import { refactorSelection } from '@/common/utils/ways';

const Search: FC<any> = ({ change }) => {
  const [form] = Form.useForm();

  const [selectionData, setSelectionData] = useState<any>({
    shopCategory: [],
    process: [],
    checkWay: [],
  });

  const [industryData, setIndustryData] = useState<any>([]);
  const [placeCategoryOptions, setPlaceCategoryOptions] = useState<any>([]);

  useEffect(() => {
    getSelection();
    getIndustryList();
    getPlaceCategoryOptions();
  }, []);

  const getSelection = async () => {
    const params = {
      keys: ['process', 'shopCategory', 'checkWay'],
    };
    const data = await footprintingManageSelection(params);
    setSelectionData(data);
  };

  const getIndustryList = async () => {
    const data = await industryList({});
    setIndustryData(data || []);
  };

  const getPlaceCategoryOptions = () => {
    placeCategoryList({}).then((data) => {
      setPlaceCategoryOptions(data || []);
    });
  };

  return (
    <SearchForm labelLength={6} onSearch={change} form={form}>
      <FormBrands
        label='需求品牌'
        name='demandBrandCode'
        form={form}
        allowClear={true}
        placeholder='请搜索并选择品牌'
      />
      <V2FormCascader
        label='所属行业'
        name='industryId'
        config={{
          multiple: false,
          maxTagCount: 'responsive',
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children',
          },
          changeOnSelect: true,
        }}
        options={industryData}
        placeholder='请选择品牌所属行业'
      />
      <V2FormProvinceList
        label='需求城市'
        name='pcdIds'
        placeholder='请选择省市/省市区'
        config={{
          changeOnSelect: true,
        }}
      />
      <V2FormSelect label='店铺类型' name='shopCategory' options={refactorSelection(selectionData.shopCategory)}/>
      <FormPlaces label='所属场地' name='placeId' form={form} allowClear={true} placeholder='请输入场地名称' />
      <V2FormSelect mode='multiple' label='场地类型' name='placeCategoryIds' options={refactorSelection(placeCategoryOptions)}/>
      <V2FormDatePicker label='踩点日期' name='checkDate' config={{ style: { width: '100%' } }}/>
      <V2FormSelect label='踩点方式' name='checkWay' options={refactorSelection(selectionData.checkWay)}/>
      <V2FormInput label='踩点人员' name='checkerName' maxLength={10}/>
      <V2FormSelect label='踩点状态' name='process' options={refactorSelection(selectionData.process)}/>
      <V2FormInput label='任务码' name='projectCode' maxLength={20}/>
    </SearchForm>
  );
};

export default Search;
