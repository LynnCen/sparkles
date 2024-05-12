/*  修改密码 */
import { FC } from 'react';
import { Modal, Form, message } from 'antd';
import { ModifyPasswordProps } from '../ts-config';
import { EIGHT_SIXTEEN_PASSWORD_REG } from '@lhb/regexp';
import { post } from '@/common/request';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInputPassword from '@/common/components/Form/V2FormInputPassword/V2FormInputPassword';

const pstRule = { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '密码格式错误' };

const ModifyPassword: FC<ModifyPasswordProps> = ({ visible, onClose, loginOut }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    form.validateFields().then((values: any) => {
      post('/account/resetPassword', values, {
        needHint: true,
        proxyApi: '/mirage'
      }).then(() => {
        message.warning('密码修改成功，请重新登录');
        setTimeout(() => {
          loginOut();
        }, 1000);
      });
    });
  };

  const onCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal title={'修改密码'} open={visible} onOk={onOk} onCancel={onCancel} destroyOnClose getContainer={false}>
      <V2Form form={form} validateTrigger='onBlur'>
        <V2FormInputPassword
          label='旧密码'
          name='oldPassword'
          config={{
            autoComplete: 'new-password'
          }}
          required />
        <V2FormInputPassword
          label='新密码'
          name='newPassword'
          rules={[{ required: true, message: '请输入新密码' }, pstRule]}
        />
        <V2FormInputPassword
          label='重复密码'
          name='rePassword'
          rules={[
            { required: true, message: '请输入重复密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('必须与新密码一致'));
              },
            })
          ]}
        />
      </V2Form>
    </Modal>
  );
};

export default ModifyPassword;
