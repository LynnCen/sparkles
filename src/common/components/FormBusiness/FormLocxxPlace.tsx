/**
 * @Description 表单资源库项目列表搜索
 */
import { FC, ReactNode, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import LocxxPlace from 'src/common/components/Select/LocxxPlace';
interface ResourceLocxxPlaceConfig extends SelectProps {
  immediateOnce?: boolean;
  needCacheSelect?: boolean
}
export interface ResourceLocxxPlaceProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: ResourceLocxxPlaceConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  channel?: string;
  formRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
  renderEmptyReactNode?: ReactNode; // 没数据时的空内容
  onChangeKeyword?: Function; // 获取联系人搜索时输入的内容
  form?: any,
  editable?: Boolean
}

const FormLocxxPlace: FC<ResourceLocxxPlaceProps & DefaultFormItemProps> = ({
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
}) => {
  let ref: any = useRef();


  if (formRef) {
    ref = formRef;
  }
  const onChange = (val: any, option: any) => {
    if (changeHandle) {
      const data = ref.current.getData();
      const originOption = data.find(item => item.id === val);
      changeHandle(val, option, originOption);
    }
  };


  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={rules}
        {...formItemConfig}>
        <LocxxPlace
          {...config}
          channel={channel}
          onRef={ref}
          extraParams={extraParams}
          defaultOptions={defaultOptions}
          allowClear={allowClear}
          placeholder={placeholder}
          onChange={onChange}
          renderEmptyReactNode={renderEmptyReactNode}
          onChangeKeyword={onChangeKeyword}/>
      </Form.Item>
    </>
  );
};

export default FormLocxxPlace;

