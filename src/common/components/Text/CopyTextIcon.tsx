import { FC, useState } from 'react';
import { isNotEmpty } from '@lhb/func';
import copy from 'copy-to-clipboard';
import cs from 'classnames';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { message as Message, Tooltip } from 'antd';

/**
 * 复制文本图标
 * @description 复制文本图标
 * @category Text
 * @demo
import CopyTextIcon from 'src/common/components/Text/CopyTextIcon';

<CopyTextIcon value='123'/>
<CopyTextIcon showMessage value='我是被复制的文本内容'/>
<CopyTextIcon showMessage message='已复制' value='我是被复制的文本内容'/>
<CopyTextIcon value='我是被复制的文本内容'>复制文本图标</CopyTextIcon>

  const successVal = () => {
    console.log('success');
  };
<CopyTextIcon value='我是被复制的文本内容' onSuccess={successVal}/>
 */
const Component:FC<{
  // 复制的内容
  value: string | number;
  // 复制成功后图标切换的时长，单位 ms
  duration?: number,
  // 是否显示复制成功的消息提示
  showMessage?: boolean,
  // 复制成功后显示的消息，如果为空，默认显示 复制成功：复制的内容
  message?: string,
  // 悬浮气泡提示文本
  tip?: string | number;
  className?: any;
  // 复制成功提示
  onSuccess?: Function;
  children?: any;
}> = ({
  value = '',
  duration = 2000,
  showMessage = false,
  message = '',
  tip = '点击复制',
  className,
  onSuccess,
  children
}) => {

  const [copyStatus, setCopyStatus] = useState(false); // 复制成功状态
  const [t, setT] = useState<any>(null); // 定时器

  // 复制成功
  const onCopy = () => {
    if (!isNotEmpty(value)) {
      return;
    }
    copy(String(value));
    if (showMessage) {
      message ? Message.success(message) : Message.success('复制成功：' + value);
    }
    onSuccess?.();
    updateCopyStatus();
  };

  // 设置复制成功状态，防止重复复制的动画频繁切换
  const updateCopyStatus = () => {
    setCopyStatus(true);
    if (t) {
      clearTimeout(t);
    }
    setT(setTimeout(() => {
      setCopyStatus(false);
      clearTimeout(t);
    }, duration));
  };

  return (<>
    {isNotEmpty(value) && <Tooltip placement='top' title={copyStatus ? '复制成功' : tip}>
      <span className={cs('pointer', copyStatus ? 'color-success' : '', className)} onClick={onCopy}>
        {children || (copyStatus ? <CheckOutlined/> : <CopyOutlined/>)}
      </span>
    </Tooltip>}
  </>);
};

export default Component;
