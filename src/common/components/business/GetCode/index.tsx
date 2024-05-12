import { FC, useEffect, useState } from 'react';
import styles from './index.module.less';
import cs from 'classnames';

import { message } from 'antd';

import { sendCaptcha } from '@/common/api/common';
interface IProps {
  form: any;
  className?: string;
}
const GetCode: FC<IProps> = ({ form, className }) => {
  const [lockTime, setLockTime] = useState<number>(0);
  const [timer, setTimer] = useState<any>();
  // 获取验证码
  const getCode = async () => {
    if (lockTime) return;
    const mobile = form.getFieldValue('mobile');
    const mobileError = form.getFieldError('mobile');
    if (!mobile || mobileError.length) {
      message.error('手机号格式不正确，请确认手机号');
      return;
    }
    await sendCaptcha({ mobile });
    setLockTime(60);
    const lockId = setInterval(() => {
      setLockTime((count) => {
        if (count <= 1) {
          clearInterval(lockId);
        }
        return count - 1;
      });
    }, 1000);
    setTimer(lockId);
  };
  /* effects */
  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);
  return (
    <span className={cs(styles.getCode, className)} onClick={getCode}>
      {lockTime ? `${lockTime} s后重新获取 ` : '获取验证码'}
    </span>
  );
};

export default GetCode;
