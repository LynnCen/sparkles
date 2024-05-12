/**
 * @Description 即插即踩搜索栏
 */
import { FC } from 'react';
import SearchForm from '@/common/components/Form/SearchForm';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import FormTenant from '@/common/components/FormBusiness/FormTenant';

const PlugCollectionSearch: FC<any> = ({ onSearch, searchForm }) => {
  return (
    <>
      <SearchForm
        form={searchForm}
        onSearch={onSearch}>
        <V2FormInput label='点位名称' name='spot' placeholder='请输入点位名称'/>
        <FormTenant
          label='租户名称'
          name='tenantId'
          allowClear={true}
          placeholder='请输入租户名称搜索'
          enableNotFoundNode={false}
          config={{
            getPopupContainer: (node) => node.parentNode,
          }}
        />
      </SearchForm>
    </>
  );
};

export default PlugCollectionSearch;
