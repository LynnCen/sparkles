import { FC, useEffect, useRef, useState, ChangeEvent } from 'react';
import { Button, Col, Input, Row } from 'antd';
import IconFont from '@/common/components/IconFont';
import styles from '../index.module.less';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

interface VerificationInputProps {
  countDownTotal?: number;
  step?: number;
  value?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  size?: SizeType;
  disable?: boolean;
  isStart?: boolean;
  onStart?: () => void;
}

// 默认计时是60秒
const defaultCountDownTotal = 60;
// 计时器默认步长为1秒
const defaultStep = 1000;

// 启动定时器
const startTimer = (cb: () => void, dealy: number) => {
  return setInterval(cb, dealy);
};

// 清除定时器
const clearTimer = (timerId: number) => {
  if (!timerId) {
    return;
  }
  clearInterval(timerId);
};


const VerificationInput: FC<VerificationInputProps> = (props) => {
  const {
    countDownTotal = defaultCountDownTotal,
    step = defaultStep,
    value,
    onChange,
    size,
    disable,
    isStart,
    onStart,
  } = props;
  const [count, setCount] = useState<number>(countDownTotal);
  const [start, setStart] = useState<boolean>(false);
  const timerId = useRef<any>(0);
  const [inutValue, setInputValue] = useState<string | undefined>();


  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { value } = target;
    setInputValue(value);
    onChange?.(value);
  };

  const onClick = () => {
    props.onClick?.();
  };

  useEffect(() => {
    if (isStart) {
      setStart(true);
      timerId.current = startTimer(() => setCount(count => --count), step);
    }
  }, [isStart]);


  // 倒计时结束恢复原样
  const resetTimer = () => {
    setStart(false);
    setCount(countDownTotal);
    clearTimer(timerId.current);
  };


  useEffect(() => {
    if (count <= 0) {
      resetTimer();
      onStart?.();
    }
  }, [count]);

  useEffect(() => {
    return () => {
      clearTimer(timerId.current);
    };
  }, []);

  return (
    <Row justify='space-between'>
      <Col flex={1}>
        <Input
          allowClear
          value={inutValue}
          onChange={onInputChange}
          placeholder='请输入验证码'
          size={size}
          prefix={<IconFont className={styles.icon} iconHref='icon-ic_password' />}
          maxLength={6}
        />
      </Col>
      <Col>
        <Button
          type='primary'
          size={size}
          className={styles.sendButton}
          /** 由于改了antd组件全局按钮大小和ui稿不符合 */
          style={{
            backgroundColor: disable || start ? '#FFCEA4' : '#ff861d',
            border: '#ff861d',
            height: size === 'large' ? 40 : 32
          }}
          disabled={start || disable}
          onClick={onClick}>
          {start ? `${count}s后重新获取` : '获取验证码' }
        </Button>
      </Col>
    </Row>
  );
};


export default VerificationInput;
