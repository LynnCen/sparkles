import CopyTextIcon from 'src/common/components/Text/CopyTextIcon';
import { FC } from 'react';

const Component:FC<any> = () => {

  const successVal = () => {
    console.log('success');
  };

  return (<div>
    <h4>基本用法</h4>

    <CopyTextIcon value='123'/>
    <CopyTextIcon showMessage value='我是被复制的文本内容'/>
    <CopyTextIcon showMessage message='已复制' value='我是被复制的文本内容'/>
    <CopyTextIcon value='我是被复制的文本内容'>复制文本图标</CopyTextIcon>

    <CopyTextIcon value='我是被复制的文本内容' onSuccess={successVal}/>

  </div>);
};

export default Component;
