/**
 * @Description 搜索
 */
import { FC, useState, useEffect } from 'react';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';
import SearchForm from '@/common/components/SearchForm';
import V2FormCascader from '@/common/components/Form/V2FormCascader/V2FormCascader';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
// import FormContacts from '@/common/components/FormBusiness/FormContacts';
import V2FormProvinceList from '@/common/components/Form/V2FormProvinceList';
import FormLocxxSupplier from '@/common/components/FormBusiness/FormLocxxSupplier';
import { getRequirementSelection, getplaceCategory } from '@/common/api/demand-management';
import { refactorSelectionNew } from '@/common/utils/ways';
import { useMethods } from '@lhb/hook';
import { FormProps } from 'antd';
import { Cascader } from 'antd';
import { contrast } from '@lhb/func';
import { post } from '@/common/request';



const { SHOW_CHILD } = Cascader;

interface FromProps extends FormProps{
  onSearch?: () => void
}

const PlaceMngSearch:FC<FromProps> = ({
  onSearch
}) => {
  const [selection, setSelection] = useState({
    placeCategoryIdList: [],
    commercials: [],
    openStatusOptions: [],
    tenantIds: []
  });

  useEffect(() => {
    methods.getSelection();
  }, []);
  const methods = useMethods({
    getSelection() {
      getRequirementSelection({ modules: 'commercial' }).then((response) => {
        setSelection(val => ({ ...val,
          commercials: refactorSelectionNew({ selection: contrast(response, 'commercials', []) }),
        }));
      });
      getplaceCategory().then((response) => {
        const newList:any = [];
        response.shopCategory
          .forEach(item => {
            newList.push({ value: item.id, label: item.name });
          });
        setSelection(val => ({ ...val,
          placeCategoryIdList: newList,
        }));
      });
      post('/common/selection/openStatus', {}, {
        needHint: true,
        proxyApi: '/zhizu-api'
      }).then((res) => {
        const result = [] as any;
        res.forEach(item => {
          result.push({ value: item.id, label: item.name });
        });
        setSelection(val => ({ ...val,
          openStatusOptions: result
        }));
      });
    },
  });

  return (
    <SearchForm
      onSearch={onSearch}
      moreBtn
      showSearchNum={4}
    >
      <V2FormInput placeholder='输入项目/街铺名称' label='项目名称' name='name' maxLength={30}/>
      <V2FormSelect
        mode='multiple'
        name='categoryIds'
        label='铺位类型'
        options={selection.placeCategoryIdList}
        placeholder='选择铺位类型'
      />
      <V2FormProvinceList
        label='所属城市'
        name='cityIds'
        placeholder='选择城市'
        type={2}
        config={{
          allowClear: true,
          changeOnSelect: true,
          multiple: true
        }}
      />
      <V2FormCascader
        label='业态'
        name='commercialIds'
        options={selection.commercials}
        config={{
          showSearch: true,
          showArrow: true,
          allowClear: true,
          changeOnSelect: true,
          multiple: true,
          maxTagCount: 'responsive',
          showCheckedStrategy: SHOW_CHILD,
        }}
        placeholder='选择业态'
      />
      <V2FormRangeInput label='铺位面积' name={['streetShopMinArea', 'streetShopMaxArea']} extra='m²' />
      <V2FormSelect
        name='openStatus'
        label='是否开业'
        options={selection.openStatusOptions}
        placeholder='选择开业状态'
      />
      <FormLocxxSupplier
        name='tenantIds'
        label='供应商'
        placeholder='输入租户名称'
      />
      <V2FormInput
        label='联系人'
        name='contactMobile'
        placeholder='输入联系人手机号'
        allowClear={true}
      />
    </SearchForm>
  );
};

export default PlaceMngSearch;
