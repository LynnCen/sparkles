import { FC, useState, useEffect } from 'react';
import { Form, message, Button } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import FormInputPassword from '@/common/components/Form/FormInputPassword';
import IconFont from '@/common/components/IconFont';
import ChangeAccount from '@/layout/components/Login/components/ChangeAccount';
import { MOBILE_REG, EIGHT_SIXTEEN_PASSWORD_REG } from '@lhb/regexp';
import { getCookie, setStorage } from '@lhb/cache';
import { post } from '@/common/request/index';
import styles from './entry.module.less';
import GetCode from '@/common/components/business/GetCode';
import { dispatchNavigate } from '@/common/document-event/dispatch';

const pstRule = { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '密码格式错误' };

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

const layoutOperate = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
const Login: FC<any> = () => {
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const token = getCookie('flow_token');

  useEffect(() => {
    token && dispatchNavigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    post('/resetPassword', values, true).then(() => {
      message.success('密码重置成功');
      // 密码重置成功执行登录操作选择企业
      post(
        '/login',
        { mobile: values.mobile, password: values.password },
        { needHint: true }
      ).then(({ token }) => {
        if (token) {
          setStorage('flowLoginToken', token);
          setShowAccountModal(true);
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <header>
        <IconFont iconHref={'iconic_logo_pc'} className={styles.logoIcon} />
      </header>
      <main>
        <div className={styles.content}>
          <p className={styles.title}>找回密码</p>
          <div className={styles.formWrap}>
            <Form form={form} onFinish={onFinish} {...layout} size='large' requiredMark={false}>
              <FormInput
                label='手机号'
                name='mobile'
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: MOBILE_REG, message: '手机号格式错误' },
                ]}
                maxLength={11}
              />
              <FormInput
                label='验证码'
                name='code'
                rules={[{ required: true, message: '请输入验证码' }]}
                maxLength={6}
                config={{
                  suffix: <GetCode className='fs-14' form={form} />,
                  className: styles.inputStyle,
                  // 表单中同时存在password的时候autoComplete='off'失效，此时设置为new-password
                  autoComplete: 'new-password',
                }}
              />
              <FormInputPassword
                name='password'
                label='密码'
                rules={[{ required: true, message: '请输入密码' }, pstRule]}
                placeholder='请输入8-16位数字、字母的组合密码'
                config={{ maxLength: 16, autoComplete: 'new-password' }}
              />
              <FormInputPassword
                label='确认密码'
                name='rePassword'
                dependencies={['password']}
                placeholder='请再次输入密码'
                rules={[
                  { required: true, message: '请再次输入密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码输入请保持一致'));
                    },
                  }),
                ]}
              />
              <Form.Item {...layoutOperate} className={styles.operateBtn}>
                <Button className={styles.cancelBtn} size='middle' onClick={() => dispatchNavigate('/')}>
                  取消
                </Button>
                <Button type='primary' size='middle' htmlType='submit'>
                  确定找回密码
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <ChangeAccount showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
      </main>
    </div>
  );
};

export default Login;
