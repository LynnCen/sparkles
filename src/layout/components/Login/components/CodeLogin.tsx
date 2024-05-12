// 手机验证码登录
import { FC, useRef, useState } from 'react';
import styles from './index.module.less';
import { Form, Button, Modal } from 'antd';
import IconFont from '@/common/components/Base/IconFont';
import V2FormInput from '@/common/components/Form/V2FormInput/V2FormInput';
import V2Form from '@/common/components/Form/V2Form';
import GetCode from '@/common/components/business/GetCode';
import { post } from '@/common/request/index';
import { MOBILE_REG } from '@lhb/regexp';
import { setStorage, setCookie } from '@lhb/cache';
import { ChangeModalStatus } from '../ts-config';
import Agreement from './Agreement';
import QyWxLogin from './QyWxLogin';
import { bigdataBtn } from '@/common/utils/bigdata';
import { isArray } from '@lhb/func';
import { Link } from 'react-router-dom';

const CodeLogin: FC<ChangeModalStatus> = ({ setShowAccountModal, setModalVisible, setInfoData, form
}) => {
  const lockRef: any = useRef(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOk = () => {
    const values = form.getFieldsValue();
    handleLogin(values);
    setOpen(false);
  };

  // 信息填写完成填入cookie跳转到首页
  const onFinish = async (values: any) => {
    const { agree } = values || {};
    // 未勾选时，agree 是undefined，勾选后再取消勾选是Array
    if (!agree || (isArray(agree) && agree.length === 0)) {
      setOpen(true);
      return;
    }
    handleLogin(values);
  };

  const handleLogin = async(values) => {
    if (lockRef.current) return;
    lockRef.current = true;
    // https://yapi.lanhanba.com/project/297/interface/api/33439
    await post('/login', { ...values }, { needHint: true,
      // isMock: true, mockId: 297, mockSuffix: '/api'
    }).then((data) => {
      bigdataBtn('40b53967-7712-4614-a8bb-a87310bf24de', '', '登录', '登录了location');
      if (data?.errCode === 'DE0519999601') {
        setInfoData({
          visible: true,
          mobile: values.mobile
        });
      } else if (data?.errCode === 'DE0519999602') { // 试用到期
        setModalVisible(true);
      } else {
        const { token, accountId } = data;
        if (token) {
          setStorage('flowLoginToken', token);
          setCookie('flow_account_id', accountId);

          setShowAccountModal(true);
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
    <div className={styles.codeLogin}>
      <V2Form form={form} onFinish={onFinish} validateTrigger={['onChange', 'onBlur']} size='large'>
        <V2FormInput
          name='mobile'
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: MOBILE_REG, message: '手机号格式错误' },
          ]}
          maxLength={11}
          config={{ autoComplete: 'on' }}
          prefix={<IconFont className={styles.icon} iconHref='iconic_phone' />}
          placeholder='请输入手机号'
        />
        <p className={styles.usernameTips}>
          <IconFont className={styles.icon} iconHref='icon-warning_o' />
          <span>未注册手机验证后自动注册登录</span>
        </p>
        <V2FormInput
          name='code'
          rules={[{ required: true, message: '请输入验证码' }]}
          placeholder='请输入验证码'
          maxLength={6}
          prefix={<IconFont className={styles.icon} iconHref='iconic_password' />}
          // prefix={<IconFont className={styles.icon} iconHref='icon-ic_password' />}
          config={{
            suffix: <GetCode form={form} />,
            className: styles.inputStyle,
          }}
        />
        <Form.Item>
          <Button type='primary' htmlType='submit' block className={styles.submitBtn}>
            登录
          </Button>
        </Form.Item>
        {
          process.env.NODE_ENV === 'development' && false && <Button type='primary' block href='/pdf'>
          去PDF页
          </Button>
        }
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

export default CodeLogin;
