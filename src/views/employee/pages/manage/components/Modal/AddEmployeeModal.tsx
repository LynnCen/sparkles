/* 新增员工弹框 */
import React, { useEffect } from 'react';
import { Form, message, Modal } from 'antd';

import { contrast } from '@lhb/func';
import { MOBILE_REG } from '@lhb/regexp';

import FormInput from '@/common/components/Form/FormInput';
import { addStoreEmployee } from '@/common/api/employee';
import { AddEmployeeProps } from '../../ts-config';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const AddEmployeeModal: React.FC<AddEmployeeProps> = ({ record, onClose, onOk }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record.visible) {
      const result: any = {
        name: contrast(record, 'name'),
        mobile: contrast(record, 'mobile'),
      };
      form.setFieldsValue({ ...result });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.visible]);

  const onCancel = () => {
    onClose({ ...record, visible: false });
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      addStoreEmployee(values).then(() => {
        message.success('新增员工成功');
        onClose({ ...record, visible: false });
        onOk();
      });
    });
  };

  return (
    <Modal
      title='新增员工'
      open={record.visible}
      width={400}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Form {...layout} form={form}>
        <FormInput
          label='手机号'
          name='mobile'
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: MOBILE_REG, message: '手机号格式错误' },
          ]}
        />
        <FormInput
          label='姓名'
          name='name'
          rules={[{ required: true, message: '请输入员工姓名' }]}
          maxLength={20}
        />
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;
