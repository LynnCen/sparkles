import { useBrand } from '@/common/hook';
import { Select } from 'antd';
import { FC } from 'react';

interface BrandSelectProps {
  brandId?: number;
  onChange?: (value: any) => void;
  value?: any
}

const BrandSelect: FC<BrandSelectProps> = ({ brandId, onChange, value }) => {

  const { onSearch, options } = useBrand(brandId!);

  return (
    <Select
      onSearch={onSearch}
      filterOption={false}
      showSearch
      allowClear
      options={options}
      onChange={onChange}
      value={value}
      placeholder='请选择品牌'/>
  );
};

export default BrandSelect;
