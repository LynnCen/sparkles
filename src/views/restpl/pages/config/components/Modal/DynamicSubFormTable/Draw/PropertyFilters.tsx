import FormInput from '@/common/components/Form/FormInput';
import FormSelect from '@/common/components/Form/FormSelect';
import FormSearch from '@/common/components/Form/SearchForm';


const PropertyFilters: React.FC<any> = ({ onSearch, filterOptions }) => {
  return (
    <>
      <FormSearch onSearch={onSearch} labelLength={5}>
        <FormInput
          name='propertyKeyWord'
          placeholder='请输入属性名称/编号/标识'
          config={{
            style: { width: 220 },
          }}
        />
        <FormSelect
          name='propertyClassificationId'
          placeholder='属性分类'
          config={{
            style: { width: 220 },
            allowClear: true
          }}
          options={filterOptions}
        />
      </FormSearch>
    </>
  );
};

export default PropertyFilters;
