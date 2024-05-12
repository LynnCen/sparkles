import { InputNumber, Select } from 'antd';
import { FC, useEffect, useState } from 'react';

interface DynamicInputNumberProps {
  value?: any;
  onChange?: (value: any) => void;
  restriction?: {
    placeholder?: string;
    suffixOptionList?: any[];
    addonAfter?: string;
    decimals?: number;
    precision?: any;
  }
}

const DynamicInputNumber: FC<DynamicInputNumberProps> = ({ restriction, value, onChange }) => {
  const { placeholder, suffixOptionList = [], addonAfter, decimals, precision } = restriction || {};
  const [selectValue, setSelectValue] = useState<any>();
  const [inputValue, setInputValue] = useState<any>();

  const onSelectChange = (value: any) => {
    setSelectValue(value);
    onChange?.({
      value: inputValue,
      suffix: value
    });
  };

  const onInputChange = (value: any) => {
    setInputValue(value);
    onChange?.({
      value,
      suffix: selectValue
    });
  };

  useEffect(() => {
    if (typeof value === 'number' || typeof value === 'string') {
      // 不带可选择的后缀
      setInputValue(value);
      setSelectValue(undefined);
      return;
    } else if (typeof value === 'object') {
      // 带可选择的后缀
      const { suffix, value: inputValue } = value || {};
      setSelectValue(suffix);
      setInputValue(inputValue);
    }
  }, [value]);

  const addAfter = (
    <Select
      options={suffixOptionList} fieldNames={{ label: 'name', value: 'name' }}
      placeholder='请选择'
      value={selectValue}
      onChange={onSelectChange}

    />
  );
  return (
    <InputNumber
      value={inputValue}
      placeholder={placeholder || '请输入'}
      onChange={onInputChange}
      precision={decimals || precision?.decimals || 0}
      addonAfter={suffixOptionList.length ? addAfter : addonAfter || null}
    />
  );
};

export default DynamicInputNumber;
