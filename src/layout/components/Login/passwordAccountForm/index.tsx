import FormInput from '@/common/components/Form/FormInput';
import { MOBILE_REG } from '@lhb/regexp';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import VerificationInput from './VerificationInput';
import { Form, message } from 'antd';
import { get } from '@/common/request';
import { FormInstance } from 'antd/es/form/Form';
import IconFont from '@/common/components/IconFont';
import styles from '../index.module.less';

const { Item } = Form;

interface PasswordAccountFormProps {
  form?: FormInstance
}


const PasswordAccountForm: FC<PasswordAccountFormProps> = (props) => {
  const { form } = props;
  const [mobile, setMobile] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
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

  useEffect(() => {
    if (mobile) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  }, [mobile]);

  const onStart = () => {
    setIsStart(false);
  };


  return (
    <>
      <FormInput
        name='mobile'
        rules={[
          { required: true, message: '请输入11位手机号码'
          },
          { pattern: MOBILE_REG, message: '输入的手机号码不合法' }
        ]}
        placeholder='请输入手机号'
        prefix={<IconFont iconHref='icon-ic_phone' className={styles.icon}/>}
        maxLength={11}
        config={{
          value: mobile,
          onChange: onChange,
          size: 'large'
        }}
      />
      {/* <FormInputPassword
        name='password'
        rules={[
          { required: true, message: '请输入密码' },
          { pattern: EIGHT_SIXTEEN_PASSWORD_REG, message: '请输入8-16位数字+字母组合' },
        ]}
        placeholder='请输入密码'
        prefix={<IconFont iconHref='icon-ic_password' />}
      /> */}
      <Item name='code' rules={
        [
          { required: true, message: '验证码不能为空' },
          { max: 6, message: '验证码最多6位' }
        ]
      }>
        <VerificationInput
          onClick={onSend}
          onStart={onStart}
          disable={disabled}
          isStart={isStart}
          size='large'/>
      </Item>
    </>
  );
};


export default PasswordAccountForm;
