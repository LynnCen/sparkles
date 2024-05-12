import { useCategoryType } from '@/common/hook';
import { TreeSelect } from 'antd';
import { FC } from 'react';

interface CategorySelectProps {
  resoureType?: 0 | 1;
  value?: any;
  multiple?: boolean
  onChange?: (value: any) => void;
  visible?: boolean;
}

const CategorySelect: FC<CategorySelectProps> = ({ resoureType = 0, visible, ...restProps }) => {
  const data = useCategoryType(resoureType, visible);
  const { multiple } = restProps;
  const placeholder = multiple === false ? '请选择类型' : '请选择类型（可多选）';
  return (<TreeSelect
    placeholder={placeholder}
    allowClear
    maxTagCount='responsive'
    showSearch
    multiple
    treeData={data}
    fieldNames = {{
    // 自定义入参格式
      label: 'name',
      value: 'id',
      children: 'childList',
    }}
    {...restProps}/>);
};

export default CategorySelect;
