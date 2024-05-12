// 品牌中心-品牌库-相似品牌搜索、选择
import { FC, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import SimilarBrand from 'src/common/components/Select/SimilarBrand';

interface SimilarBrandConfig extends SelectProps {
  immediateOnce?: boolean;
}
export interface SimilarBrandProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SimilarBrandConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  formRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
}

const FormSimilarBrand: FC<SimilarBrandProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `输入${label}关键词，并选择`,
  allowClear = true,
  extraParams = {},
  formItemConfig = {},
  config = { suffixIcon: <SearchOutlined className='fs-14' /> },
  changeHandle,
  defaultOptions,
  formRef,
  // finallyData,
}) => {
  let ref: any = useRef();
  if (formRef) {
    ref = formRef;
  }
  const onChange = (val: any, option: any) => {
    if (changeHandle) {
      const data = ref.current.getData();
      const originOption = data.find(item => {
        return item.id === val;
      });
      changeHandle(val, option, originOption);
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <SimilarBrand
        {...config}
        onRef={ref}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}/>
    </Form.Item>
  );
};

export default FormSimilarBrand;

