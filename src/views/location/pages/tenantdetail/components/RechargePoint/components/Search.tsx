import {
  FC,
  useEffect,
  useState
} from 'react';
import { tenantSelectionByKey } from '@/common/api/location';
import SearchForm from '@/common/components/Form/SearchForm';
import FormRangePicker from '@/common/components/Form/FormRangePicker';
import FormSelect from '@/common/components/Form/FormSelect';
import { isArray } from '@lhb/func';

const Search: FC<any> = ({
  onSearch,
  form
}) => {
  const [tradeTypes, setTradeTypes] = useState<any[]>([]);

  useEffect(() => {
    getSelection();
  }, []);

  const getSelection = () => {
    tenantSelectionByKey({
      keys: ['tradeType']
    }).then(({ tradeType }) => {
      if (isArray(tradeType) && tradeType.length) {
        setTradeTypes(tradeType);
      }
    });
  };

  return (
    <SearchForm
      form={form}
      onSearch={onSearch}
    >
      <FormRangePicker
        label='交易时间'
        name='date'
        config={{
          style: { width: '100%' },
          allowClear: true
        }} />
      <FormSelect
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}
        label='交易类型'
        name='tradeType'
        options={tradeTypes}
        allowClear />
    </SearchForm>
  );
};

export default Search;
