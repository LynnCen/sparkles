import { FC, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { EMAIL_REG } from '@lhb/regexp';
import FormInput from '@/common/components/Form/FormInput';
import FormCheckbox from '@/common/components/Form/FormCheckbox';
import { currentUserInfo } from '@/common/api/brief';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

interface IProps {
  visible: boolean;
  onOk: (params: any) => void;
  onClose: () => void;
}

const ModalExport: FC<IProps> = ({ visible, onOk, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      const getUserInfo = async () => {
        currentUserInfo().then((data) => {
          form.setFieldsValue({ email: data?.email });
        });
      };
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const submitHandle = () => {
    form.validateFields().then(async (values: any) => {
      const { email, isSync } = values;
      onOk({ email, isSync: isSync && isSync.length ? isSync[0] : 0 });
    });
  };

  return (
    <Modal title='下载明细' open={visible} destroyOnClose={true} onOk={submitHandle} onCancel={onClose}>
      <Form form={form} preserve={false} colon={false} name='form' {...layout}>
        <FormInput
          label='输入邮箱'
          name='email'
          placeholder='请输入邮箱地址'
          rules={[
            { required: true, message: '请输入有效的邮箱地址' },
            { pattern: EMAIL_REG, message: '邮箱格式错误' },
          ]}
        />
        <FormCheckbox
          label=' '
          name='isSync'
          formItemConfig={{ colon: false }}
          options={[{ label: '保存邮箱，方便下次使用', value: 1 }]}
        />
      </Form>
    </Modal>
  );
};

export default ModalExport;
