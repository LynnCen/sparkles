// 表单项-联系人列表
import { FC, ReactNode, useRef, useState } from 'react';
import { Button, Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import { SearchOutlined } from '@ant-design/icons';
import Contacts from 'src/common/components/Select/Contacts';
import styles from './index.module.less';
import EditContact from './EditContact';
interface ResourceContactsConfig extends SelectProps {
  immediateOnce?: boolean;
  needCacheSelect?: boolean
}
export interface ResourceContactsProps {
  placeholder?: string;
  allowClear?: boolean;
  extraParams?: any;
  config?: ResourceContactsConfig;
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

const FormContacts: FC<ResourceContactsProps & DefaultFormItemProps> = ({
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
  form,
  editable = false
}) => {
  let ref: any = useRef();
  const [editData, setEditData] = useState({ visible: false });
  const curId = Form.useWatch(name, form);
  const btnDisabled = !!(curId);

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

  const edit = () => {
    setEditData(state => ({ ...state, visible: true }));
  };
  // 编辑联系人回调
  const complete = (val:any) => {
    if (!val) return;
    form.setFieldValue(name, val?.id || null);
    ref.current.setOptions([val]);
  };

  return (
    <>
      <div className={editable ? styles.contacts : undefined}>
        <Form.Item
          name={name}
          label={label}
          rules={rules}
          {...formItemConfig}>
          <Contacts
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
        {editable ? <Button type='primary' onClick={edit} disabled={!btnDisabled}>编辑</Button> : ''}
      </div>
      {/* 编辑联系人 */}
      <EditContact editData={editData} setEditData={setEditData} complete={complete} contactId={curId}></EditContact>
    </>
  );
};

export default FormContacts;

