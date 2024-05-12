/* eslint-disable react-hooks/exhaustive-deps */
/* 新增/编辑属性分类 */
import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import { post } from '@/common/request';
import { CategoryModalProps } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const CategoryOperate: FC<CategoryModalProps> = ({ operateCategory, setOperateCategory, onSearch }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (operateCategory.visible) {
      if (operateCategory.id) {
        form.setFieldsValue({ ...operateCategory });
      } else {
        form.resetFields();
      }
    }
  }, [operateCategory.visible]);

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      // 保存-https://yapi.lanhanba.com/project/462/interface/api/45107
      const url = '/shop/category/save';
      const params = {
        ...values,
        ...(operateCategory.id && { id: operateCategory.id }),
      };
      post(url, params, { proxyApi: '/blaster' }).then(() => {
        onCancel();
        onSearch();
      });
    });
  };

  const onCancel = () => {
    setOperateCategory({ visible: false });
  };

  return (
    <>
      <Modal
        title={!operateCategory.id ? '新建属性分类' : '编辑属性分类'}
        open={operateCategory.visible}
        onOk={onSubmit}
        width={600}
        onCancel={onCancel}
        getContainer={false}
      >
        <Form {...layout} form={form}>
          <FormInput
            label='分类名称'
            name='name'
            rules={[{ required: true, message: '请输入属性分类名称' }]}
            maxLength={20}
          />
          <FormInput
            label='分类标识'
            name='code'
            rules={[{ required: true, message: '请输入属性分类编码' }]}
            maxLength={20}
          />
        </Form>
      </Modal>
    </>
  );
};

export default CategoryOperate;
