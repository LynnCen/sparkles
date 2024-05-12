import { FC } from 'react';

import { Modal, Form } from 'antd';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInputNumber from '@/common/components/Form/V2FormInputNumber/V2FormInputNumber';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: (values: Record<string, any>) => void;
}

const SignModal: FC<IProps> = ({ isOpen, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <Modal title='该备选址确认已签约？' open={isOpen} onOk={handleSubmit} onCancel={onCancel} width={600}>
      <V2Form form={form} name='form' layout='horizontal'>
        <V2FormInputNumber label='成交租金: ' min={0} max={9999999} config={{ addonAfter: '元/月' }} name='contractRent' required />
      </V2Form>
    </Modal>
  );
};

export default SignModal;
