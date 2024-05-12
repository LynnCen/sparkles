import { CSSProperties, FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useMethods } from '@lhb/hook';
import { isNotEmpty } from '@lhb/func';
import { Sources } from '@/views/locxx/pages/simulatedResponse/index';
import Iframe from 'src/common/components/Iframe/index';
import eventLib from 'src/common/document-event/index';

export interface UrlParamsProps {
  /** 来源：pms、locxx，以哪个身份发起会话  */
  source?: Sources,
  /** 对方用户token-账号中心 */
  token?: string | number | null,
  contactId?: string | number | null, // 联系人id
  resourceId?: string | number | null, // 来源id
  requirementId?: string | number | null, // 需求id
  consultation?: string | number | null, // 是否创建咨询会话
  virtualAccount?: string | null, // 虚拟账号
}

/**
 * @description: IM 对话
 * @demo
import IM from 'src/common/components/Business/IM/index';

// token 方式登录
<IM style={{ width: '375px', height: '667px' }} source='locxx' token={getStorage('kunlun_token')}  />
<IM style={{ width: '375px', height: '667px' }} source='locxx' token={getCookie('kunlun_token')}  />
// 发起咨询
<IM style={{ width: '375px', height: '667px' }} source='locxx' token={getCookie('kunlun_token')} contactId={208263} resourceId={1000187} />
 */
const Component: FC<{ style?: CSSProperties } & UrlParamsProps & { ref?: any }> = forwardRef(({ style, source, token, contactId, resourceId, requirementId, consultation, virtualAccount }, ref) => {

  useImperativeHandle(ref, () => ({
    inputMessageText: iframeRef.current?.inputMessageText
  }));

  /* state */

  const iframeRef = useRef<any>();

  // IM 链接参数
  const [urlParams, setUrlParams] = useState<UrlParamsProps & { timestamp?: number }>({
    timestamp: 1, // 版本，提供刷新链接
    source: Sources.LOCXX, // 来源：pms、locxx，以哪个身份发起会话
    token: null, // 登录 token
    contactId: null, // 对方用户id-账号中心
    resourceId: null, // 资源id
    requirementId: null, // 需求id
    consultation: null, // 是否创建咨询会话
    virtualAccount: null, // 虚拟账号
  });

  useEffect(() => {
    setUrlParams((state) => ({ ...state, source, token, contactId, resourceId, requirementId, consultation, virtualAccount }));
  }, [source, token, contactId, resourceId, requirementId, consultation, virtualAccount]);

  const url = useMemo(() => {
    if (!urlParams.token) {
      return '';
    }
    const query = {
      is_admin: 1, // 管理员模拟登录
      source: urlParams.source || Sources.LOCXX,
      token: urlParams.token || '',
      contact_id: urlParams.contactId || '',
      resource_id: urlParams.resourceId || '',
      requirement_id: urlParams.requirementId || '',
      timestamp: urlParams.timestamp || '',
      consultation: urlParams.consultation || '',
      virtual_account: urlParams.virtualAccount || ''
    };
    const url = process.env.IM_URL;
    // const url = 'https://192.168.88.22:9899';
    // let url = process.env.NODE_ENV === 'development' ? 'https://10.10.8.47:9899' : process.env.IM_URL;
    return `${url}/#/home?${Object.entries(query).filter(item => isNotEmpty(item[1])).map(item => `${item[0]}=${item[1]}`).join('&')}`;
  }, [urlParams]);

  /* hooks */
  useEffect(() => {
    // const { contact_id, resource_id, requirement_id } = getUrlParams(location.search);
    // methods.open({ contactId: contact_id, resourceId: resource_id, requirementId: requirement_id });

    // 全局监听
    // 打开
    eventLib.on('OPEN_IM', methods.open);
    // 关闭
    eventLib.on('HIDE_IM', methods.close);
    // 刷新
    eventLib.on('REFRESH_IM', methods.refresh);
    // 初始化
    eventLib.on('INIT_IM', methods.initIM);

    return () => {
      eventLib.remove('OPEN_IM', methods.open);
      eventLib.remove('HIDE_IM', methods.close);
      eventLib.remove('REFRESH_IM', methods.refresh);
      eventLib.remove('INIT_IM', methods.initIM);
    };
  }, []);

  /* methods */
  const methods = useMethods({
    // 打开 IM 窗口
    open(data: UrlParamsProps = {}) {
      const { source, token, contactId, resourceId, requirementId, consultation } = data || {};
      setUrlParams((state) => ({ ...state, source, token, contactId, resourceId, requirementId, consultation }));

      // window.LHBbigdata.send({ // 埋点-IM 消息
      //   event_id: '14e966b7-318e-4686-98dc-813e48616c8b', // 事件id-IM 消息
      //   msg: {
      //     spotIds: resourceId ? [resourceId] : null, // 点位ids
      //   }
      // });

    },
    // （提供给父级）关闭 IM 页面
    close() {
      // 关闭会话，防止未读消息被消耗
      iframeRef.current?.closeConversation?.();
    },
    // （提供给父级）刷新 IM 页面
    refresh() {
      setUrlParams((state) => ({ ...state, timestamp: +new Date() }));
    },
    // 初始化 IM
    initIM() {
      iframeRef.current?.initIM?.();
    },
  });

  return <div style={Object.assign({ overflow: 'hidden' }, style)}>
    <Iframe ref={iframeRef} src={url} config={{ allow: 'clipboard-write;geolocation' }}/>
  </div>;
});

export default Component;
