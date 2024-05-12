import { Button, Form, message } from 'antd';
import FormInput from '@/common/components/Form/FormInput';
import FormInputPassword from '@/common/components/Form/FormInputPassword';
import IconFont from '@/common/components/IconFont';
import { setCookie } from '@lhb/cache';
import { post } from '@/common/request';
import { EIGHT_SIXTEEN_PASSWORD_REG } from '@lhb/regexp';
import { LoginParams, LoginResult } from './ts-config';
import styles from './index.module.less';
import { isObject } from '@lhb/func';

const Login = () => {
  const onFinish = (values) => {
    const params: LoginParams = {
      ...values,
      tenant: 'linhuiba',
    };
    if (params.username?.includes('@')) {
      const arr = params.username.split('@');
      params.username = arr[0];
      params.tenant = arr[1];
    }
    post('/login', params, {
      needHint: true,
      proxyApi: '/blaster'
    }).then((data: LoginResult) => {
      const token = data.token;
      let timeWait = 100;
      if (process.env.NODE_ENV !== 'development') { // 开发环境屏蔽
        if (isObject(token)) { // 如果是对象，就上报
          // 主动send事件
          window.LHBbigdata.send({
            event_id: 'kunlun_new_cookie_monitoring_token', // 事件id
            msg: data, // 额外需要插入的业务信息
          });
          timeWait = 200; // 有bug，先采集，晚点再刷新
        }
      }
      // 存储token
      setCookie('kunlun_token', token);
      message.success('登录成功，跳转首页');
      // 刷新页面
      setTimeout(() => {
        window.location.reload();
      }, timeWait);
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.left}>
          {/* <div className={styles.logo}>
            <IconFont iconHref='icon-ic_logo_pc' />
          </div> */}
          <div className={styles.mainImg}></div>
          <div className={styles.rightBottomImg}></div>
        </div>
        <div className={styles.right}>
          <p className={styles.title}>SaaS管理后台</p>
          <div className={styles.rightTopImg}></div>
          <Form className={styles.loginForm} onFinish={onFinish}>
            <FormInput
              name='username'
              rules={[{ required: true, message: '请输入用户名' }]}
              placeholder='请输入用户名'
              prefix={<IconFont className={styles.icon} iconHref='icon-ic_account1' />}
              maxLength={32}
              config={{ autoComplete: 'on' }}
            />
            <FormInputPassword
              name='password'
              rules={[
                { required: true, message: '请输入密码' },
                { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '请输入8-16位数字+字母组合' },
              ]}
              placeholder='请输入密码'
              prefix={<IconFont className={styles.icon} iconHref='icon-ic_password' />}
            />
            <Form.Item>
              <Button htmlType='submit' type='primary' size='large' block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
