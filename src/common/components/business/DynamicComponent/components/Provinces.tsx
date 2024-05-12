/**
 * @Description 省市区组件
 */

import { FC } from 'react';
import FormProvinceList from '@/common/components/FormBusiness/FormProvinceList';

const Provinces: FC<any> = ({
  propertyItem,
  required,
  ...props
}) => {
  const label = propertyItem.anotherName || propertyItem.name || '';
  const restriction = propertyItem.restriction ? JSON.parse(propertyItem.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `选择详细地址后自动获取`;
  const rules = [
    { required, message: placeholder },
  ];

  return (
    <FormProvinceList
      label={label}
      name={propertyItem.identification}
      placeholder={placeholder}
      type={1}
      rules={rules}
      {...props}
    />
  );
};

export default Provinces;
