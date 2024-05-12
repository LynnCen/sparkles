/**
 * 表单项用户列表
 */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DefaultFormItemProps } from '@/common/components/Form/ts-config';
import UserList from '@/common/components/Select/UserList';

export interface FormUserListProps {
  form?: any;
  placeholder?: string;
  allowClear: boolean;
  extraParams?: any;
  config?: SelectProps;
  changeHandle?: Function; // 映射select的onChange
  finallyData?: Function; // 取出获取到数据
  getUserListFunc?: Function; // 获取userList接口
  className?: any;
  formRef?: any;
  immediateOnce?: boolean; // 渲染时是否直接渲染一次
  renderEmptyReactNode?: React.ReactNode; // 无内容时显示
  needTenantLink?: boolean; // 是否与租户联动，添加可见人员的定制参数，租户选择更新后会变更员工选择内容
}

const FormUserList: React.FC<FormUserListProps & DefaultFormItemProps> = ({
  name,
  label,
  rules,
  form,
  placeholder,
  allowClear = false,
  extraParams = {},
  formItemConfig = {},
  config = {},
  changeHandle,
  finallyData,
  getUserListFunc,
  className,
  formRef,
  immediateOnce = true,
  renderEmptyReactNode,
  needTenantLink = false,
}) => {
  let ref: any = useRef();
  const [originOptions, setOriginOptions] = useState<any>([]);

  useImperativeHandle(formRef, () => ({
    addOption: ref?.current?.addOption,
    setOptions: ref?.current?.setOptions,
    getItem: ref?.current?.getItem,
    reload: ref?.current?.reload,
  }));

  if (formRef) {
    ref = formRef;
  }

  // 添加可见人员弹窗中的定制逻辑，租户选择变更后需要重新加载
  useEffect(() => {
    if (extraParams && needTenantLink) {
      ref.current?.reload();
    }
  }, [extraParams, needTenantLink]);

  const onChange = (val: any) => {
    changeHandle && changeHandle(val);
    form.setFieldsValue({
      [name as string]: val
    });
  };

  const onFinallyData = (data) => {
    setOriginOptions(data);
    finallyData?.(data);
  };

  const onFocus = () => {
    const userIds = form.getFieldValue(name);
    const selectedIds: any = [];
    if (userIds?.length) {
      const oldOptions = originOptions.filter((item) => {
        if (!userIds.includes(item.id)) return true;
        selectedIds.push(item);
        return false;
      });
      ref?.current?.setOptions([...selectedIds, ...oldOptions], true);
    }
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      className={className}
      {...formItemConfig}>
      <UserList
        {...config}
        onRef={ref}
        getUserListFunc={getUserListFunc}
        extraParams={extraParams}
        allowClear={allowClear}
        placeholder={placeholder}
        onChange={onChange}
        finallyData={onFinallyData}
        renderEmptyReactNode={renderEmptyReactNode}
        needTenantLink={needTenantLink}
        immediateOnce={immediateOnce}
        onFocus={onFocus}
        onBlur={() => ref?.current?.reload()}
      />
    </Form.Item>
  );
};

export default FormUserList;
