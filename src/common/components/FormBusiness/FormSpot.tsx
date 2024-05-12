/**
 * 点位联想查询
 */
import { FC, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import Spot from '../Select/Spot';
import { SearchOutlined } from '@ant-design/icons';


interface SpotConfig extends SelectProps {
  immediateOnce: boolean;
}
export interface FormSpotProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: SpotConfig;
  changeHandle?: Function; // 映射select的onChange
  defaultOptions?: any[];
  channel?: string;
  needAddableNotFoundNode?: boolean; // 是否需要显示无数据特别处理模块
  spotRef?: any; // ref示例
  // finallyData?: Function; // 取出获取到数据
}

const FormSpot: FC<FormSpotProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  placeholder = `输入${label}关键词，并选择`,
  allowClear = true,
  extraParams = {},
  formItemConfig = {},
  config = { suffixIcon: <SearchOutlined className='fs-14' /> },
  needAddableNotFoundNode,
  changeHandle,
  defaultOptions,
  channel,
  spotRef,
  // finallyData,
}) => {
  let ref: any = useRef();
  if (spotRef) {
    ref = spotRef;
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
      <Spot
        {...config}
        channel={channel}
        onRef={ref}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        needAddableNotFoundNode={needAddableNotFoundNode}
        onChange={onChange}/>
    </Form.Item>
  );
};

export default FormSpot;

