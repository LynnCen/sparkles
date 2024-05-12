// 字典选择器，根据 type 获取对应的选项数据
// 字典类型   （推广形式：promotionWay）（推广目的：promotionPurpose）（物料：material）
import { useDictionaries } from '@/common/hook';
import { Select } from 'antd';
import { FC } from 'react';

interface DictionarySelectProps {
  value?: any;
  onChange?: (value: any) => void;
  type?: string;
  placeholder?: string
}

const DictionarySelect: FC<DictionarySelectProps> = ({ type, placeholder, ...props }) => {
  const options = useDictionaries(type!);

  return (
    <Select
      filterOption={false}
      options={options}
      mode='multiple'
      maxTagCount='responsive'
      placeholder={placeholder}
      {...props}/>
  );
};

export default DictionarySelect;
