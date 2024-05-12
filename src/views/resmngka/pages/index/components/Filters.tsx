import FormCheckboxGroup from '@/common/components/Form/FormCheckboxGroup';
import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import SearchForm from '@/common/components/Form/SearchForm';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';

const Filters: React.FC<any> = ({ onSearch, resourceType, props, spotParam }) => {
  const [levelOptions, setLevelOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [cusTypeOptions, setCusTypeOptions] = useState([]);
  const [otherOptions, setOtherOptions] = useState([]);
  const [spotTypeOptions, setSpotTypeOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    props.forEach((property) => {
      if (property.identification === 'kaLevel') {
        setLevelOptions(property.propertyOptionList);
      }
      if (property.identification === 'kaType') {
        setTypeOptions(property.propertyOptionList);
      }
      if (property.identification === 'kaCusType') {
        setCusTypeOptions(property.propertyOptionList);
      }
      if (property.identification === 'kaOther') {
        setOtherOptions(property.propertyOptionList);
      }
      if (property.identification === 'kaSpotType') {
        setSpotTypeOptions(property.propertyOptionList);
      }
    });
    if (spotParam && spotParam.placeId) {
      form.setFieldsValue({ placeId: spotParam.placeId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, spotParam]);
  return (
    <>
      <SearchForm onSearch={onSearch} labelLength={5} form={form}>
        <FormInputNumber
          label='场地ID'
          name={resourceType === 0 ? 'id' : 'placeId'}
          config={{ style: { width: '180px' } }}
          placeholder='请输入场地ID'
        />
        <FormInput
          label='场地关键字'
          name={resourceType === 0 ? 'name' : 'placeName'}
          config={{ style: { width: '180px' } }}
          placeholder='请输入名称进行搜索'
        />
        {resourceType !== 0 ? (
          <FormInput
            label='点位关键字'
            name='spotName'
            config={{ style: { width: '180px' } }}
            placeholder='请输入名称进行搜索'
          />
        ) : (
          <></>
        )}

        <FormProvinceList
          label='城市'
          name='cityIds'
          placeholder='请选择'
          type={2}
          config={{ style: { width: '180px' }, multiple: true }}
        />
        <FormCheckboxGroup label='等级' name='levelIds' options={levelOptions} formItemConfig={{ style: { width: '980px' } }}/>
        <FormCheckboxGroup label='类型' name='typeIds' options={typeOptions} formItemConfig={{ style: { width: '980px' } }}/>
        <FormCheckboxGroup label='客群分类' name='customerTypeIds' options={cusTypeOptions} formItemConfig={{ style: { width: '980px' } }}/>
        <FormCheckboxGroup label='其他资源' name='otherResourceIds' options={otherOptions} formItemConfig={{ style: { width: '980px' } }}/>
        {resourceType !== 0 ? (
          <FormCheckboxGroup label='展位类型' name='kaSpotType' options={spotTypeOptions} formItemConfig={{ style: { width: '980px' } }}/>
        ) : (
          <></>
        )}
      </SearchForm>
    </>
  );
};

export default Filters;
