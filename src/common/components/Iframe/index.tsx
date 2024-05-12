import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { isNotEmpty } from '@lhb/func';
import { useMethods } from '@lhb/hook';
// import { NavBar } from 'antd-mobile';
import Empty from 'src/common/components/Empty/index';

// 发送消息给子页面的消息类型
enum PostMessageToSonType {
  /** 刷新页面 */
  RELOAD = 'reload',
  /** 关闭会话 */
  CLOSE_CONVERSATION = 'closeConversation',
  /** 初始化 IM */
  INIT_IM = 'initIM',
  /** 在 IM 的输入框内输入文本信息 */
  INPUT_MESSAGE_TEXT = 'inputMessageText',
}

/**
 * @description: iframe 嵌入
 * @demo
import Iframe from 'src/common/components/Iframe/index';
<Iframe src='xxx'/>
 */
const Component:FC<{
  title?: string, // 标题
  src: string, // 链接
  ref?: any,
  config?: any
}> = forwardRef(({ title, src, config }, ref) => {

  useImperativeHandle(ref, () => ({
    reloadIframe: methods.reloadIframe,
    closeConversation: methods.closeConversation,
    initIM: methods.initIM,
    inputMessageText: methods.inputMessageText,
  }));

  /* state */
  const iframeRef = useRef<any>();

  /* hooks */
  useEffect(() => {

    window.addEventListener('message', methods.getMessageForSon);
    return () => {
      window.removeEventListener('message', methods.getMessageForSon);
    };
  }, []);

  /* methods */
  const methods = useMethods({
    // 重新加载 iframe
    reloadIframe() {
      // 会报错，使用另一种
      // iframeRef.current?.contentWindow.location.reload();
      // 通过 postMessageToSon 通知子级刷新
      methods.postMessageToSon({ type: PostMessageToSonType.RELOAD });
    },
    // （提供给父级）关闭会话
    closeConversation() {
      console.log('CLOSE_CONVERSATION');
      this.postMessageToSon({ type: PostMessageToSonType.CLOSE_CONVERSATION });
    },
    // （提供给父级）初始化 IM
    initIM() {
      console.log('INIT_IM');
      this.postMessageToSon({ type: PostMessageToSonType.INIT_IM });
    },
    // 在 IM 的输入框内输入文本信息
    inputMessageText(text) {
      console.log('inputMessageText text', text);
      if (isNotEmpty(text)) {
        this.postMessageToSon({ type: PostMessageToSonType.INPUT_MESSAGE_TEXT, data: text });
      }
    },

    // 后退
    back() {
      history.back();
    },
    // 接收子级值消息
    getMessageForSon(event) {
      const data = event.data || {};
      switch (data.type) {
        // token过期
        // 页面关闭
        case 'close':
          // methods.back(); // pc 不需要关闭页面
          break;
      }
    },
    // 向子页面传值
    postMessageToSon({ type, data }: { type: PostMessageToSonType, data?: any}) {
      if (!type) {
        return;
      }
      console.log('向子页面传值', type, data);
      const iframe = iframeRef.current?.contentWindow;
      iframe.postMessage({ type: type, data: data }, '*');
    },
  });

  return (<div style={{ width: '100%', height: '100%' }}>
    {/* {isNotEmpty(title) && <NavBar onBack={methods.back}>{title}</NavBar>} */}
    {src ? <iframe ref={iframeRef} key={src} src={src} style={{ border: 0, width: '100%', height: isNotEmpty(title) ? 'calc(100% - 50px)' : '100%' }} {...config }></iframe> : <Empty/>}
  </div>);
});

export default Component;
