/**
 * @Description 多选框模板属性限制配置
 */
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import React from 'react';

const FormRangeInput: React.FC<{ csName: string }> = ({ csName }) => {

  return (
    <V2FormRangeInput
      label="选择限制"
      name={[[csName,'min'], [csName, 'max']]}
      extra='项'
      useBaseRules={true} />
  );
};
export default FormRangeInput;
