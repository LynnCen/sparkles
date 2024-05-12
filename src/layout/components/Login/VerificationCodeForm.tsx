import FormInput from '@/common/components/Form/FormInput';
import FormInputPassword from '@/common/components/Form/FormInputPassword';
import IconFont from '@/common/components/IconFont';
import { EIGHT_SIXTEEN_PASSWORD_REG } from '@lhb/regexp';
import { FC } from 'react';
import styles from './index.module.less';

interface VerificationCodeFormProps {
}


const VerificationCodeForm: FC<VerificationCodeFormProps> = () => {
  return (
    <>
      <FormInput
        name='username'
        rules={[{ required: true, message: '请输入用户名/手机号' }]}
        placeholder='请输入用户名'
        prefix={<IconFont className={styles.icon} iconHref='icon-ic_account1' />}
        maxLength={32}
        config={{ autoComplete: 'on', size: 'large' }}
      />
      <FormInputPassword
        config={{ size: 'large' }}
        name='password'
        rules={[
          { required: true, message: '请输入密码' },
          { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '请输入8-16位数字+字母组合' },
        ]}
        placeholder='请输入密码'
        prefix={
          <IconFont
            className={styles.icon}
            iconHref='icon-ic_password' />
        }
      />
    </>
  );
};


export default VerificationCodeForm;
