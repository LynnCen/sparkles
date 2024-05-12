import { RequestConfig } from '@/../types/interface/config';
import { logout } from '@/common/utils/ways';
import { getCookie } from '@lhb/cache';
import { deepCopy, isDef } from '@lhb/func';
import { message as AntdMessage } from 'antd';
import axios from 'axios';

// MockUrl
const mockUrl = 'https://yapi.lanhanba.com/mock/';
const baseUrl = '/api';

// 高德项目前缀
const applicationRadarPrefix = '/radar';

/**
 * 请求基础配置
 */
const baseConfig: any = {
  needCancel: true, // 是否需要在下次请求发生时，对之前的请求进行 abortControl
  isMock: false, // 是否mock方式
  mockId: 289, // 其他后台mock的id
  needHint: false, // 是否需要主动报错
  proxyApi: '', // 需要代理的其他 api目标， 会替换掉当前目标的 /res
  errorConfig: {
    needHint: false,
    duration: 3, // 报错后多久小时，秒
    showClose: false, // 是否显示关闭按钮，开启后报错弹窗将不会主动消失
  },
};

/**
 * 异常处理
 */
class ApiError extends Error {
  code: string;
  constructor(err: { message?: string; msg?: string; code: string }) {
    const msg: string = err.message || err.msg || '';
    super(msg);
    Object.assign(this, err);
    this.code = err.code;
  }
}

/**
 * 获取header
 * @param _version 版本号
 * @param isPost 是否是 Post 请求
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getHeader(_version = 1, isPost = false): any {
  const apiKey = getCookie('kunlun_token');
  const config = {
    // Accept: `application/vnd.linhuiba.v${version}+json`,
    // Authorization: apiKey ? `Bearer ${apiKey}` : 'Bearer',
    clientKey: 1000210,
    ...(apiKey && { token: apiKey }),
  };

  return isPost ? { ...config, ...{ 'Content-Type': 'application/json' } } : config;
}

/**
 * 合并请求
 * @param extraConfig
 */
export function mergeConfig(extraConfig: any): RequestConfig {
  const _baseConfig = deepCopy(baseConfig);
  // 为了方便 第三个参数为boolean 值时可控制needHint值
  if (typeof extraConfig === 'boolean') {
    _baseConfig.errorConfig.needHint = extraConfig;
    return _baseConfig;
  } else if (extraConfig.needHint) {
    _baseConfig.errorConfig.needHint = extraConfig.needHint;
  }
  return { ..._baseConfig, ...extraConfig };
}

/**
 * 返回配置后的请求URl
 */
export function getRequestUrl(serviceName: string, config: RequestConfig): string {
  if (config.isRadar) {
    return `${applicationRadarPrefix}${serviceName}`;
  }
  return (
    (process.env.NODE_ENV === 'development' && config.isMock ? `${mockUrl}${config.mockId || baseConfig.mockId}` : `${config.proxyApi || '/res'}`) + baseUrl + serviceName
  );
}

/**
 * 错误的请求处理
 * @param err
 * @param config
 */
export function fail(err: any, config: RequestConfig): null {
  if (axios.isCancel(err)) {
    throw new ApiError({
      code: 'cancel',
      msg: '您取消了请求',
    });
  }

  const needHint = config.errorConfig && config.errorConfig.needHint;
  const duration = config.errorConfig && config.errorConfig.duration;
  const showClose = (config.errorConfig && config.errorConfig.showClose) || false;
  const errorOptions: any = {
    type: 'error',
    duration,
    closable: showClose,
  };
  if (err.response) {
    const {
      status,
      data: { errMsg },
    } = err.response;
    switch (status) {
      case 401:
        errorOptions.content = '未登录';
        break;
      case 403:
        errorOptions.content = '未授权';
        break;
      case 404:
        errorOptions.content = '资源不存在';
        break;
      case 422: // 表单错误
        errorOptions.content = errMsg;
        break;
      case 429:
        errorOptions.content = '休息一会儿，稍后回来';
        break;
      case 500:
        errorOptions.content = '服务器出了小差~';
        break;
      default:
        if (needHint) {
          errorOptions.content = errMsg;
        }
        break;
    }
    console.log('>>>>>', needHint);
    // 一些需要用户手动关闭的提示弹窗
    // 约定为420
    // 如，批量操作部分失败的情况
    if (errorOptions.content) {
      if (status === 401) {
        logout();
      } else {
        AntdMessage.open(errorOptions);
      }
    }
  }
  throw new ApiError(err);
}

/**
 * 成功请求处理
 * remark: 暂时未做处理，预留
 * @param res
 */
export function success(response: any, config: any) {
  const { headers, data } = response;
  if (config.isMock || isDef(data)) {
    if (config.responseType === 'blob') { // 处理字节流接口数据，返回文件名和 data
      const contentDisposition = headers?.['content-disposition'] || headers?.['Content-Disposition'];
      return {
        filename: isDef(contentDisposition) ? decodeURIComponent(String(contentDisposition).replace(/^.*filename=/, '') || '') : '',
        data
      };
    }
    return data;
  } else {
    // AntdMessage.open({
    //   type: 'error',
    //   content: data.msg,
    // });
  }
  throw new ApiError(data);
}

/**
 * 获取 axios 请求配置
 * @param requestConfig
 * @param axiosConfig
 */
export function getAxiosConfig(requestConfig: RequestConfig, axiosConfig: any = {}) {
  const { needCancel = true, responseType } = requestConfig;
  // 需要cancel的时候，就加入cancelToken
  if (needCancel) {
    // axios会根据 cancelToken是否存在，进行打断。
    axiosConfig.cancelToken = {};
  }
  if (responseType) {
    axiosConfig.responseType = responseType;
  }

  return axiosConfig;
}
