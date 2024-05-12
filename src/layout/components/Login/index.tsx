import { Button, Divider, Form, message, Space, Tabs } from 'antd';
import { setCookie } from '@lhb/cache';
import { post } from '@/common/request';
import { LoginParams, LoginResult } from './ts-config';
import styles from './index.module.less';
import VerificationCodeForm from './VerificationCodeForm';
import PasswordAccountForm from './passwordAccountForm';
import ChangePassword from './ChangePassword';
import { useVisible } from '@/views/application/pages/menu-managent/hooks';
import { useState } from 'react';
import IconFont from '@/common/components/IconFont';
import { MOBILE_REG } from '@lhb/regexp';
import { dispatchNavigate } from '@/common/document-event/dispatch';
import { isObject } from '@lhb/func';

const { Item, useForm } = Form;

const Login = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>('0');
  const { visible, onShow, onHidden } = useVisible(false);
  const [form] = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const onActiveKeyChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

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
    setLoading(true);
    post('/login', params, {
      needHint: true,
      proxyApi: '/mirage'
    }).then((data: LoginResult) => {
      const token = data.token;
      const employeeId = data.employeeId;
      const tenantId = data.tenantId;
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
      setCookie('kunlun_user_id', employeeId);
      setCookie('saas_tenant_id', tenantId);
      message.success('登录成功，跳转首页');
      // 刷新页面
      setTimeout(() => {
        window.location.reload();
      }, timeWait);
    }).finally(() => setLoading(false));
  };

  // 提交form表单
  const handleSubmit = async () => {
    let values = await form.validateFields();
    const { username } = values;
    if (MOBILE_REG.test(username)) {
      values = {
        ...values,
        mobile: username
      };
    }
    onFinish(values);
  };

  const onSubmit = (success: boolean) => {
    if (success) {
      message.success('修改成功');
      onHidden();
    }
  };

  const onCancelSubmit = () => {
    onHidden();
  };



  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <IconFont iconHref='icon-logo' />
            </div>
            <div className={styles.mainImg}></div>
            <div className={styles.rightBottomImg}></div>
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.right}>
              <p className={styles.title}>SaaS运营后台</p>
              <p className={styles.subTitle}>Perfect SaaS Master</p>
              <Tabs
                activeKey={activeKey}
                onChange={onActiveKeyChange}
                items={[
                  { label: '验证码登录', key: '0' },
                  { label: '密码登录', key: '1' },
                ]}/>
              <div className={styles.rightTopImg}></div>
              <Form
                className={styles.loginForm}
                form={form}
              >
                {/* <VerificationCodeForm/> */}
                { activeKey === '1' ? <VerificationCodeForm /> : <PasswordAccountForm form={form}/> }
                <Space
                  className={styles.spaceWrapper}
                  split={<Divider type='vertical' />}>
                  <Button type='link' onClick={onShow}>忘记密码?</Button>
                  {/* <Button >注册账号</Button> */}
                </Space>
                <Item>
                  <Button
                    block
                    size='large'
                    type='primary'
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? '正在登录中' : '登录'}
                  </Button>
                </Item>
                {process.env.NODE_ENV === 'development' && <Item>
                  <Button
                    block
                    size='large'
                    type='primary'
                    onClick={() => { dispatchNavigate('/pdf'); }}
                  >
                   去PDF页
                  </Button>
                </Item>}
              </Form>
            </div>
          </div>
        </div>
      </div>
      <ChangePassword
        visible={visible}
        onSubmit={onSubmit}
        onCancelSubmit={onCancelSubmit}
      />


    </>
  );
};

export default Login;
