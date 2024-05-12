/**
 * @description 企微登录
 * 逻辑分支一：第一次访问且登陆成功
 * 第一次从企微工作台打开该应用，打开的链接中已经拼接了corpId，执行getUri()方法，通过corpId和当前页面的地址（domain + path）拿到重定向地址，然后进行重定向，重定向后会在url中携带code，拿到code后，执行loginByWx，通过code来换取token，此时接口返回的数据中，例如：
 * {
 * "accountId":1202,
 * "employeeId":220272,
 * "errCode":null,
 * "errMsg":null,
 * "multiTenant":false,
 * "tenantId":10749,
 * "token":"*****"
 * }
 * 此时如果multiTenant为true，存储flowLoginToken，用来获取企业列表，然后执行切换企业的操作进行登录
 * 此时如果multiTenant为false，接口的token已经是正式的token，直接setCookie('flow_token'),存储登录状态
 * 逻辑分支二：存储过登录状态后的访问
 * 直接读取cookie中的flow_token进行访问应用，token过期会自动踢出去
 * 逻辑分支三：第一次访问但未访问成功
 *
 */
import { getWxOauth2AuthorizeUri, loginByWxCode } from '@/common/api/common';
import { getCookie, getStorage, setCookie, setStorage } from '@lhb/cache';
import { getParameterByName } from '@/common/utils/ways';
import { FC, useEffect } from 'react';
import styles from './index.module.less';
import { message } from 'antd';
import IconFont from '@/common/components/IconFont';
import { isMobile, isObject } from '@lhb/func';

// message.config({
//   maxCount: 10,
// });

const QyWxLogin: FC<any> = ({
  setShowAccountModal
}) => {

  const isQyWx = window.navigator.userAgent.includes('wxwork'); // 判断是否在企业微信环境中

  useEffect(() => {
    if (!isQyWx) return;
    // 已经是登录状态，直接访问
    const token = getCookie('flow_token');
    // 如果存在token则直接打开选择租户弹窗，说明是已经登录但把选择租户弹窗关掉了
    if (token) {
      if (isMobile() && process.env.INSIGHT_URL) {
        window.location.href = process.env.INSIGHT_URL + '/home';
        return;
      }
      window.location.href = '/';
      return;
    }

    // 获取当前访问的url中的code
    const code = getParameterByName('code');
    const urlCorpId = getParameterByName('corpId'); // 重定向之前的地址中才包含这个参数，参考逻辑分支一的说明
    // 第一次访问该应用，参看逻辑分支一
    if (!code && urlCorpId) {
      setStorage('flowCorpId', urlCorpId); // 存储corpId
      login();
      return;
    }
    // 第一次访问该应用，重定向完之后才会执行到此逻辑，此时url中包含了code，参看逻辑分支一
    const corpId = getStorage('flowCorpId');
    // 包含code的时候直接登录
    if (code && corpId) {
      // message.info(`拿到的code， ${code}`);
      loginByWx(code, corpId);
    }
  }, []);

  /**
 * @description 登录
 * @param code code企业微信返回
 * @param corpId
 */
  const loginByWx = (code, corpId) => {
    message.loading('正在授权登录中，请稍等...');
    loginByWxCode({
      code, // 授权之后地址栏返回code信息
      corpId // 地址栏返回的url中包含corpId信息
    }).then((res) => {
      // message.info(`拿code换到的token：${JSON.stringify(res)}`);
      const {
        employeeId, // 对应租户下的员工id
        token,
        tntInstId: tenantId,
        multiTenant // 是否是多个租户下的用户
      } = res;
      if (multiTenant) { // 需要执行切换租户操作
        token && setStorage('flowLoginToken', token);
        setShowAccountModal(true);
        return;
      }
      let timeWait = 1;
      if (process.env.NODE_ENV !== 'development') { // 开发环境屏蔽
        if (isObject(token)) { // 如果是对象，就上报
          // 主动send事件
          window.LHBbigdata.send({
            event_id: 'console_pc_cookie_monitoring_token', // 事件id
            msg: res, // 额外需要插入的业务信息
          });
          timeWait = 200;
        }
      }
      // 存储相关状态，访问应用
      tenantId && setCookie('tenantId', tenantId);
      employeeId && setCookie('employeeId', employeeId);
      token && setCookie('flow_token', token);
      setTimeout(() => {
        if (isMobile() && process.env.INSIGHT_URL) {
          window.location.href = process.env.INSIGHT_URL + '/home';
        } else {
          window.location.href = '/';
        }
      }, timeWait);
      // process.env.CONSOLE_H5_URL && (window.location.href = process.env.CONSOLE_H5_URL);
      // token && setStorage('flowLoginToken', token);
      // accountId && setCookie('flow_account_id', accountId);
      // corpId && setStorage('flowCorpId', corpId); // 存储corpId

      // setShowAccountModal(true);
    }).catch(() => {
      message.warning('登录失败，请重新进入应用');
    });
  };

  /**
  * @description 获取重定向url
  * @param uri 转意当前url
  * @param corpId
  */
  const getUri = (uri, corpId) => {
    getWxOauth2AuthorizeUri({
      redirectUri: uri, // TODO: 当前地址栏
      corpId: String(corpId), // 地址栏返回的url中包含corpId信息或者获取存储种的corpId
    }).then((res) => {
      const link = res; // 重定向链接
      window.location.href = link;
    }).catch(() => {
      message.warning('授权失败，请重新进入应用');
    });
  };

  // 登陆
  const login = () => {
    const token = getCookie('flow_token');
    // 如果存在token则直接打开选择租户弹窗，说明是已经登录但把选择租户弹窗关掉了
    if (token) {
      if (isMobile() && process.env.INSIGHT_URL) {
        window.location.href = process.env.INSIGHT_URL + '/home';
        return;
      }
      window.location.href = '/';
      return;
    }

    const locationLink = encodeURIComponent(window.location.href.split('?')[0]);
    const corpId = getParameterByName('corpId') || getStorage('flowCorpId');
    getUri(locationLink, corpId);
    // const corpId = getParameterByName('corpId') || getStorage('flowCorpId');
    // corpId && setStorage('flowCorpId', corpId); // 存储corpId
    // const code = getParameterByName('code');

    // corpId && setStorage('flowCorpId', corpId); // 存储corpId
    // code ? loginByWx(code, corpId) : getUri(locationLink, corpId);
  };

  return (
    isQyWx ? <div className={styles.qyWxLogin}>
      <div onClick={login} className={styles.qwLoginBtn}>
        <IconFont iconHref='iconicon-coloeEnterpriseWeChat' style={{ fontSize: 18 }} className='mr-6' />
        企业微信登录
      </div>
    </div>
      : <></>
  );
};

export default QyWxLogin;
