import React from 'react';
import { Form, Modal, message } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormTextArea from '@/common/components/Form/V2FormTextArea/V2FormTextArea';

const FeedbackModal: React.FC<any> = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onSubmit = () => {
    form.validateFields().then(() => {
      message.success('提交成功');
      onCancel();
    });
  };

  return (
    <Modal title='新增工作进度反馈' open={visible} width={336} onOk={onSubmit} onCancel={onCancel} destroyOnClose>
      <V2Form form={form}>
        <V2FormTextArea
          name='remark'
          label='工作进度反馈'
          placeholder='请输入工作进度反馈'
          maxLength={200}
          required={true}
          config={{
            rows: 3,
          }}
        />
      </V2Form>
    </Modal>
  );
};

export default FeedbackModal;
