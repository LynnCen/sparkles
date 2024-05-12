import { useIndusties } from '@/common/hook';
import { Cascader } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { FC } from 'react';

interface IndustrySelectProps {
  type?: number;
  value?: any;
  multiple?: boolean;
  onChange?: (value, selectedOptions) => void;
  placeholder?: string;
  visible?: boolean;
  fieldValue?: string;
  children?: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IndustrySelect: FC<IndustrySelectProps> = ({ type = 1, children, multiple = true, placeholder, fieldValue, visible, ...restProps }) => {
  const data = useIndusties();
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      option => (option.name as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  return (<>
    <Cascader
      placeholder={placeholder || '请选择行业'}
      allowClear
      showSearch={{ filter }}
      maxTagCount='responsive'
      multiple={multiple}
      options={data}
      showCheckedStrategy={Cascader.SHOW_CHILD}
      fieldNames = {{
        // 自定义入参格式
        label: 'name',
        value: fieldValue || 'id',
      }}
      {...restProps}/>
  </>);
};

export default IndustrySelect;
