/**
 * @Description 销售额预测
 */

import { FC, useEffect } from 'react';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';
import { parseValueCatch } from '../config';

const SaleAmount: FC<any> = ({
  form,
  formItemData,
  required,
}) => {
  const label = formItemData.anotherName || formItemData.name || '';
  const restriction = formItemData.restriction ? JSON.parse(formItemData.restriction) : {};
  const placeholder = restriction.placeholder ? restriction.placeholder : `选择详细地址后自动获取`;

  useEffect(() => {
    const curVal = parseValueCatch(formItemData);
    // console.log('useEffect SaleAmount formItemData', formItemData);
    // console.log('log SaleAmount parseValueCatch', curVal);

    form.setFieldsValue({
      [formItemData.identification]: curVal?.saleAmount,
    });
  }, [formItemData, formItemData.textValue]);

  return (
    <V2FormInputNumber
      label={label}
      name={formItemData.identification}
      placeholder={placeholder}
      required={required}
      disabled={true}
    />
  );
};

export default SaleAmount;
