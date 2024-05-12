import FormInput from '@/common/components/Form/FormInput';
import FormInputPassword from '@/common/components/Form/FormInputPassword';
import FormInModal from '@/common/components/formInModal';
import { Form, message } from 'antd';
import { ChangeEvent, FC, useState } from 'react';
import VerificationInput from './passwordAccountForm/VerificationInput';
import { EIGHT_SIXTEEN_PASSWORD_REG } from '@lhb/regexp';
import { get } from '@/common/request';
import IconFont from '@/common/components/IconFont';
import styles from '../Login/index.module.less';

const { Item, useForm } = Form;

interface ChangePasswordProps {
  visible: boolean;
  [key: string]: any
}

const ChangePassword: FC<ChangePasswordProps> = (props) => {
  const { visible, ...restProps } = props;
  const [mobile, setMobile] = useState<string>('');
  const [form] = useForm();
  const [isStart, setIsStart] = useState<boolean>(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { value } = target;
    setMobile(value as string);
  };

  const onSend = async() => {
    if (!form) {
      return;
    }

    // await form.validateFields();
    const data = await get('/sendCode', { mobile }, {
      proxyApi: '/mirage',
      needHint: true
    }).catch(() => {
      setIsStart(false);
    });
    if (data) {
      message.success('短信发送成功');
      setIsStart(true);
    }
  };

  const onStart = () => {
    setIsStart(false);
  };


  return (
    <FormInModal
      visible={visible}
      form={form}
      url='/account/forgetPassword'
      proxyApi='/mirage'
      title='找回密码'
      {...restProps}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <FormInput
          label='手机号'
          name='mobile'
          config={
            {
              value: mobile,
              onChange: onChange,
              prefix: (<IconFont iconHref='icon-ic_phone' className={styles.icon}/>)
            }
          }/>
        <Item
          label='验证码'
          name='code'>
          <VerificationInput
            onClick={onSend}
            isStart={isStart}
            onStart={onStart}
          />
        </Item>
        <FormInputPassword
          label='密码'
          name='password'
          rules={[
            { required: true, message: '请输入密码' },
            { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '请输入8-16位数字+字母组合' },
          ]}
        />
        <FormInputPassword
          label='确认密码'
          name='rePassword'
          rules={[
            { required: true, message: '请输入密码' },
            { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '请输入8-16位数字+字母组合' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入密码不一致'));
              },
            }),
          ]}
        />
      </Form>
    </FormInModal>
  );
};

export default ChangePassword;
