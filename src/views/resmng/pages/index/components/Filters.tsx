import { getCategoryRes } from '@/common/api/category';
import FormDatePicker from '@/common/components/Form/FormDatePicker';
import FormInput from '@/common/components/Form/FormInput';
import FormInputNumber from '@/common/components/Form/FormInputNumber';
import FormSelect from '@/common/components/Form/FormSelect';
import FormTreeSelect from '@/common/components/Form/FormTreeSelect';
import SearchForm from '@/common/components/Form/SearchForm';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';
import { useMethods } from '@lhb/hook';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';

const statusOptions = [
  { label: '已通过', value: 2 },
  { label: '待完善', value: 4 },
];
const Filters: React.FC<any> = ({ onSearch, resourceType, spotParam }) => {
  const [placeCategory, setPlaceCategory] = useState([]);
  const [spotCategory, setSpotCategory] = useState([]);
  const [form] = Form.useForm();

  const { loadData } = useMethods({
    loadData: async () => {
      const result = await getCategoryRes({ resourcesType: 0 });
      setPlaceCategory(result || []);

      const result2 = await getCategoryRes({ resourcesType: 1 });
      setSpotCategory(result2 || []);
    },
  });

  useEffect(() => {
    loadData();
    if (spotParam && spotParam.placeId) {
      form.setFieldsValue({ placeId: spotParam.placeId });
    }

    // eslint-disable-next-line
  }, [spotParam]);

  return (
    <>
      <SearchForm onSearch={onSearch} labelLength={5} form={form} isFooterButtonLine={true}>
        {resourceType === 0 ? (
          <>
            <FormInputNumber
              label='场地ID'
              name='placeId'
              placeholder='请输入场地ID'
              config={{ style: { width: '180px' } }}
            />
            <FormInput
              label='场地名称'
              name='placeName'
              placeholder='请输入场地名称'
              config={{ style: { width: '180px' } }}
            />
            <FormTreeSelect
              name='placeCategoryId'
              label='场地类目'
              placeholder='请选择类目进行搜索'
              treeData={placeCategory}
              config={{
                fieldNames: { label: 'name', value: 'id', children: 'childList' },
                style: { width: '180px' },
                allowClear: true,
              }}
            />
            <FormProvinceList
              label='所属城市'
              name='cityId'
              placeholder='请选择'
              config={{ style: { width: '180px' } }}
            />
            <FormSelect
              label='审核状态'
              name='status'
              options={statusOptions}
              config={{ style: { width: '180px' }, allowClear: true }}
            />
            <FormInput
              label='管理方'
              name='managerName'
              placeholder='请输入管理方名称'
              config={{ style: { width: '180px' } }}
            />
            <FormInput
              label='场地负责人'
              name='placePersonInCharge'
              placeholder='请输入场地负责人'
              config={{ style: { width: '180px' } }}
            />
            <FormInput
              label='场地联系人'
              name='placeContacts'
              placeholder='请输入场地联系人'
              config={{ style: { width: '180px' } }}
            />

            <FormInputNumber
              label='点位数量'
              name='spotCountMin'
              config={{ style: { width: '180px' } }}
              placeholder='最小点位数量'
            />
            <FormInputNumber name='spotCountMax' config={{ style: { width: '180px' } }} placeholder='最大点位数量' />
          </>
        ) : (
          <>
            <FormInputNumber
              label='场地ID'
              name='placeId'
              config={{ style: { width: '180px' } }}
              placeholder='请输入场地ID'
            />
            <FormInput
              label='场地名称'
              name={resourceType === 0 ? 'name' : 'placeName'}
              config={{ style: { width: '180px' } }}
              placeholder='请输入场地名称'
            />
            <FormInput
              label='点位名称'
              name={resourceType === 0 ? 'name' : 'spotName'}
              config={{ style: { width: '180px' } }}
              placeholder='请输入点位名称'
            />
            <FormTreeSelect
              name='placeCategoryId'
              label='场地类目'
              placeholder='请选择类目进行搜索'
              treeData={placeCategory}
              config={{
                fieldNames: { label: 'name', value: 'id', children: 'childList' },
                style: { width: '180px' },
                allowClear: true,
              }}
            />
            <FormTreeSelect
              name='spotCategoryId'
              label='点位类目'
              placeholder='请选择类目进行搜索'
              treeData={spotCategory}
              config={{
                fieldNames: { label: 'name', value: 'id', children: 'childList' },
                style: { width: '180px' },
                allowClear: true,
              }}
            />
            <FormProvinceList
              label='所属城市'
              name='cityId'
              placeholder='请选择'
              config={{
                style: { width: '180px' },
              }}
            />
            <FormSelect
              label='审核状态'
              name='status'
              options={statusOptions}
              config={{
                style: { width: '180px' },
                allowClear: true,
              }}
            />
            <FormInput
              label='摆摊位置'
              name={'stallPosition'}
              config={{
                style: { width: '180px' },
              }}
              placeholder='请输入摆摊位置'
            />
            <FormInputNumber
              label='点位总面积'
              name={'spotTotalAreaMin'}
              config={{
                style: { width: '180px' },
              }}
              placeholder='最小点位总面积'
            />
            <FormInputNumber
              name={'spotTotalAreaMax'}
              config={{
                style: { width: '180px' },
              }}
              placeholder='最大点位总面积'
            />
            <FormDatePicker
              label='更新时间'
              name='gmtModified'
              rules={[{ required: false, message: '请选择更新时间' }]}
              config={{
                style: { width: '180px' },
                format: 'YYYY-MM-DD'
              }}
            />
          </>
        )}
      </SearchForm>
    </>
  );
};

export default Filters;
