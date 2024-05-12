/**
 * @Description 点位联想查询 调用资源服务接口，没有数据则提供快捷创建入口
 */
import { FC, useRef } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import SelectSpot from '../Select/SelectSpot';


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
  form?: any;
  addHandle?: Function; // 新增点位回调
  // finallyData?: Function; // 取出获取到数据
}

const FormSpot: FC<FormSpotProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
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
  addHandle,
  // finallyData,
}) => {
  let ref: any = useRef();
  if (spotRef) {
    ref = spotRef;
  }

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      {...formItemConfig}>
      <SelectSpot
        {...config}
        channel={channel}
        onRef={ref}
        form={form}
        extraParams={extraParams}
        defaultOptions={defaultOptions}
        allowClear={allowClear}
        placeholder={placeholder}
        needAddableNotFoundNode={needAddableNotFoundNode}
        onChange={(val: any, option) => changeHandle?.(val, option)}
        onAdd={addHandle}
      />
    </Form.Item>
  );
};

export default FormSpot;

