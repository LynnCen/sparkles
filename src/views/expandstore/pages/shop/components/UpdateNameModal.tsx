/**
 * @Description 编辑名称弹框
 */
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Message from '@/common/components/Others/V2Hint/V2Message';
import { updateShopName } from '@/common/api/expandStore/shop';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const UpdateNameModal: React.FC<any> = ({
  visible,
  setVisible,
  record,
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [isLock, setIsLock] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      form.setFieldValue('name', record.name || '');
    } else {
      form.resetFields();
    }
  }, [visible]);

  const onCancel = () => {
    setVisible(false);
  };

  const onSuccess = () => {
    V2Message.success('变更成功');
    setVisible(false);
    onRefresh && onRefresh();
  };

  const onSubmit = () => {
    form.validateFields().then((values: any) => {
      if (isLock) return;
      setIsLock(true);
      const params = {
        id: record.id,
        name: values.name,
      };
      updateShopName(params).then(() => {
        onSuccess();
      }).finally(() => {
        setIsLock(false);
      });
    });
  };

  return (
    <Modal title='编辑' open={visible} width={400} onOk={onSubmit} onCancel={onCancel}>
      <Form {...layout} form={form}>
        <V2FormInput
          label='门店名称'
          name='name'
          maxLength={50}
          required/>
      </Form>
    </Modal>
  );
};

export default UpdateNameModal;
