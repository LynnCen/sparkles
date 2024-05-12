// 账号密码登录
import { FC, useRef, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { Form, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import IconFont from '@/common/components/Base/IconFont';
import V2FormInputPassword from '@/common/components/Form/V2FormInputPassword/V2FormInputPassword';
import V2Form from '@/common/components/Form/V2Form';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import Agreement from './Agreement';
import { MOBILE_REG } from '@lhb/regexp';
import { post } from '@/common/request/index';
import { setCookie, setStorage } from '@lhb/cache';
import { ChangeModalStatus } from '../ts-config';
import QyWxLogin from './QyWxLogin';
import { bigdataBtn } from '@/common/utils/bigdata';
import { isObject, isArray } from '@lhb/func';

const pstRule = { pattern: /^.{8,16}$/, message: '请输入8-16位密码' };
const passWordPrefix = (
  <p className={cs(styles.passwordTips, 'color-primary-operate')}>
    <Link to='/password'>忘记密码</Link>
  </p>
);

const AccountLogin: FC<ChangeModalStatus> = ({ setShowAccountModal, setModalVisible, setInfoData, form }) => {
  const lockRef: any = useRef(false);

  const [open, setOpen] = useState<boolean>(false);

  const handleOk = () => {
    const values = form.getFieldsValue();
    handleLogin(values);
    setOpen(false);
  };

  // 信息填写完成填入cookie跳转到首页
  const onFinish = async (values: any) => {
    // if (!values.agree) {
    //   message.warning('请先勾选Location《保密协议》、《服务条款》、《隐私政策》');
    //   return;
    // }
    const { agree } = values || {};
    // 未勾选时，agree 是undefined，勾选后再取消勾选是Array
    if (!agree || (isArray(agree) && agree.length === 0)) {
      // message.warning('请先勾选Location《保密协议》、《服务条款》、《隐私政策》');
      setOpen(true);
      return;
    }
    handleLogin(values);
  };

  const handleLogin = async(values) => {
    // // https://yapi.lanhanba.com/project/94/interface/api/12382
    const params = { ...values };
    // 是否需要选择企业
    let isNeedChooseAccount: boolean = false;
    // 如果是手机号入参为mobile
    if (MOBILE_REG.test(values.username)) {
      params.mobile = values.username;
      delete params.username;
      isNeedChooseAccount = true;
    }
    if (lockRef.current) return;
    lockRef.current = true;
    await post('/login', { ...params }, { needHint: true,
      // isMock: true, mockId: 297, mockSuffix: '/api'
    }).then((res) => {
      bigdataBtn('40b53967-7712-4614-a8bb-a87310bf24de', '', '登录', '登录了location');
      if (res?.errCode === 'DE0519999601') {
        setInfoData({
          visible: true,
          mobile: params.mobile
        });
      } else if (res?.errCode === 'DE0519999602') { // 试用到期
        setModalVisible(true);
      } else {
        const { token, accountId } = res;
        if (!token) return;
        setCookie('flow_account_id', accountId);
        if (isNeedChooseAccount) {
          setStorage('flowLoginToken', token);
          setShowAccountModal(true);
        } else {
          let timeWait = 100;
          if (process.env.NODE_ENV !== 'development') { // 开发环境屏蔽
            if (isObject(token)) { // 如果是对象，就上报
              // 主动send事件
              window.LHBbigdata.send({
                event_id: 'console_pc_cookie_monitoring_token', // 事件id
                msg: res, // 额外需要插入的业务信息
              });
              timeWait = 200;
            }
          }
          setCookie('flow_token', token);
          setTimeout(() => {
            window.location.reload();
          }, timeWait);
        }
      }
    }).finally(() => {
      // 这里加延时是因为setShowAccountModal的逻辑导致的，显示弹窗过程时，内部组件又有一个异步的逻辑，导致弹窗还未弹出时，按钮依然可以点击到
      setTimeout(() => {
        lockRef.current = false;
      }, 250);
    });
  };

  return (
    <div className={styles.AccountLogin}>
      <V2Form form={form} validateTrigger={['onChange', 'onBlur']} onFinish={onFinish} size='large'>
        <V2FormInput
          name='username'
          maxLength={30}
          prefix={<IconFont className={styles.icon} iconHref='iconic_account' />}
          rules={[{ required: true, message: '请输入用户名' }]}
          config={{ autoComplete: 'on' }}
          placeholder='请输入手机号或用户名@企业简称'
        />
        {/* <p className={styles.usernameTips}>
          <IconFont className={styles.icon} iconHref='icon-warning_o' />
          员工账号规则为：手机号或用户名@企业简称
        </p> */}
        <V2FormInputPassword
          name='password'
          rules={[{ required: true, message: '请输入密码' }, pstRule]}
          placeholder='请输入密码'
          config={{ maxLength: 16 }}
          formItemConfig={{ className: 'mb-16' }}
          prefix={<IconFont className={styles.icon} iconHref='iconic_password' />}
        />
        {passWordPrefix}
        <Form.Item>
          <Button type='primary' htmlType='submit' block className={styles.submitBtn}>
            登录
          </Button>
        </Form.Item>
        <Agreement/>
        <QyWxLogin
          setShowAccountModal={setShowAccountModal}
        />
      </V2Form>

      <Modal
        title='提示'
        okText='同意并登录'
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
      >
        <p>
          <IconFont iconHref={'iconwarning-circle1'} className='c-ff8 mr-8'/>
          登录前，请先阅读并同意
          <Link to='/openweb/service' className={styles.agreeBtn}>《用户协议》</Link>
          与
          <Link to='/openweb/privacy' className={styles.agreeBtn}>《隐私政策》</Link>
        </p>
      </Modal>
    </div>
  );
};

export default AccountLogin;
