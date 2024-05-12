import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2FormRangeInput from '@/common/components/Form/V2FormRangeInput/V2FormRangeInput';
import React from 'react';

const InputConfig: React.FC<{ csName: string }> = ({ csName }) => {
  return (
    <>
      <V2FormInput
        label="默认提示语"
        name={[csName, 'placeholder']}
      />
      <V2FormRangeInput
        label="字数限制"
        name={[[csName,'min'], [csName, 'max']]}
        extra='字'
        precision={0}
        min={0}
        max={9999}
      />
    </>
  );
};
export default InputConfig;
