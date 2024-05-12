// 表单项-资源-品牌列表
import { FC, ReactNode, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import ResourceBrand from 'src/common/components/Select/ResourceBrand';

interface ResourceBrandConfig extends SelectProps {
  immediateOnce?: boolean;
}
export interface ResourceBrandProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: ResourceBrandConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  channel?: string;
  formRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
  renderEmptyReactNode?: ReactNode; // 没数据时的空内容
  onChangeKeyword?: Function; // 获取品牌搜索时输入的内容
  api?: any; // 请求接口
}

const FormResourceBrand: FC<ResourceBrandProps & DefaultFormItemProps> = ({
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
  channel,
  formRef,
  // finallyData,
  renderEmptyReactNode,
  onChangeKeyword,
  api
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
      <ResourceBrand
        {...config}
        channel={channel}
        onRef={ref}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        api={api}
        onChange={onChange}
        renderEmptyReactNode={renderEmptyReactNode}
        onChangeKeyword={onChangeKeyword}/>
    </Form.Item>
  );
};

export default FormResourceBrand;

