// 登录页
import { useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';
import { Form, Tabs } from 'antd';
import { isMobile, urlParams } from '@lhb/func';
import CodeLogin from './components/CodeLogin';
import AccountLogin from './components/AccountLogin';
import ChangeAccount from './components/ChangeAccount';
import ModalHint from '@/common/components/business/ModalHint';
import { MOBILE_REG } from '@lhb/regexp';
import CompleteInfo from '../CompleteInfo';

const Login = () => {
  const [accountForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 试用用户到期时联系客服提示框
  const [imgLoad, setImgLoad] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<any>({
    visible: false,
    mobile: undefined
  });
  // 是否是官网跳转过来的
  const isPortal = urlParams(location.search)?.isPortal;
  console.log(isMobile(), '是否是移动端');
  const imgOnload = () => {
    setImgLoad(true);
  };
  const onChange = (v) => {
    if (v === 'accountLogin') { // 跳转到密码登录
      const value = codeForm.getFieldValue('mobile');
      if (value) {
        accountForm.setFieldValue('username', value);
        accountForm.validateFields(['username']);
      }
    } else { // 跳转到验证码登录
      let value = accountForm.getFieldValue('username');
      if (value) {
        value = value.split('@')[0];
        if (MOBILE_REG.test(value)) {
          codeForm.setFieldValue('mobile', value);
          codeForm.validateFields(['mobile']);
        }
      }
    }
  };
  return (
    <>
      <div className={cs(styles.container, isMobile() && styles.mobileContainer)}>
        <div className={styles.fixShadowWhiteLine}>
          <div className={cs(styles.content, imgLoad && styles.show)}>
            { !isMobile() && <img src='https://staticres.linhuiba.com/project-custom/locationpc/console-pc-login.png?t=2023052502' alt='' onLoad={imgOnload}/> }
            <div className={styles.wrapper}>
              <div className={styles.rightWrapper}>
                <div className={styles.right}>
                  <p className={styles.title}>欢迎登录</p>
                  <Tabs
                    defaultActiveKey='codeLogin'
                    size='large'
                    tabBarGutter={48}
                    onChange={onChange}
                    items={[
                      { label: '验证码登录', key: 'codeLogin', children: <CodeLogin setShowAccountModal={setShowAccountModal} setModalVisible={setModalVisible} form={codeForm} setInfoData={setInfoData}/> },
                      { label: '密码登录', key: 'accountLogin', children: <AccountLogin setShowAccountModal={setShowAccountModal} setModalVisible={setModalVisible} form={accountForm} setInfoData={setInfoData} /> }
                    ]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangeAccount showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
      {
        infoData.visible && <CompleteInfo infoData={infoData} isPortal={+isPortal === 1}/>
      }

      <ModalHint
        visible={modalVisible}
        setVisible={setModalVisible}
        content='用户已到期，如需继续试用或者了解更多详情请联系客服'/>
    </>
  );
};

export default Login;
