/**
 * @Description 部门岗位绑定Item
 */
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { Form } from 'antd';
// import cs from 'classnames';
// import styles from './entry.module.less';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTreeSelect from '@/common/components/Form/V2FormTreeSelect/V2FormTreeSelect';
import V2FormSelect from '@/common/components/Form/V2FormSelect/V2FormSelect';

const Item: any = forwardRef<any, any>(({
  item,
  departmentListData, // 部门列表
  postListData, // 岗位列表
  index, // 索引
  changeHandle
}, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    item && form.setFieldsValue(item);
  }, [item]);

  const onValuesChange = (changedValues: any, allValues: any[]) => {
    changeHandle && changeHandle(index, allValues);
  };

  // 将load方法暴露给父组件，可在父组件中使用该方法
  useImperativeHandle(ref, () => ({
    submit: submitHandle
  }));

  const submitHandle = () => {
    return form.validateFields();
  };
  return (
    <V2Form
      form={form}
      onValuesChange={onValuesChange}>
      <V2FormTreeSelect
        label='部门'
        name='departmentIds'
        required
        treeData={departmentListData}
        config={{
          fieldNames: {
            label: 'name',
            value: 'id',
            children: 'children'
          },
          multiple: true,
          showSearch: true,
          treeNodeFilterProp: 'name',
          treeDefaultExpandAll: true,
        }}
      />
      <V2FormSelect
        label='岗位'
        required
        name='positionId'
        options={postListData}
        config={{
          fieldNames: {
            label: 'name',
            value: 'id'
          }
        }}
      />
    </V2Form>
  );
});

export default Item;
