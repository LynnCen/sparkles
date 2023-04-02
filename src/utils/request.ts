/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import { connect, getLocale, history } from 'umi';
import userspace from '@/userspace';

import {
  baseURL,
  langMap,
  CODE_OK,
  INVALID_TOKEN,
} from './constants';

import { setStreamClientConstructor } from '@/ts_pkc/ts-baselib';

import type { RequestMethod } from 'umi-request';
import type {StreamClient} from '@/ts_pkc/ts-baselib';
import { Json } from '@/ts_pkc/ts-json';

class Response<T> {
  constructor(public code:number, public data:T, public msg: string = '') {
  }
}

class Client implements StreamClient {
  private readonly request: RequestMethod;
  constructor(baseUrl: string) {
    this.request = extend({
      credentials: 'include',
      timeout: 0,
      headers: {
        // 'Content-Type': 'application/json;charset=utf-8', // multipart/form-data
      },
      prefix: baseUrl,
      // suffix: '.json'
    })

    this.init()
  }

  init():void {
    // before req
    this.request.interceptors.request.use((url, options) => {
      const currentLang = getLocale();
      const token = localStorage.getItem('token');
            
      if (options?.headers) {
        // eslint-disable-next-line no-param-reassign
        options.headers['lang'] = langMap[currentLang];
        if (token) {
          // eslint-disable-next-line no-param-reassign
          options.headers['token'] = token;
        }

        options.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        options.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
      }
      
      return {
        options: {
          ...options,
        },
      };
    });
    // before res
    this.request.interceptors.response.use(async (response) => {
      
      const data = await response.clone().json();

      if (response && response.status === CODE_OK) {
        // if (data.code === CODE_OK) {
        //   // only login returns token. so we check here
        //   return data
        // }
        // if (
        //   data.code === INVALID_TOKEN
        // ) {
        //   history.replace(`/user/login`);
        // }
        return data
      } else {
        const msgKeys = Object.keys(data.message);
        const msgInfo = msgKeys.length
          ? `${msgKeys[0]}: ${data.message[msgKeys[0]]}`
          : '服务器异常，请稍后重试!';
        message.error({
          content: msgInfo,
        });
        // history.replace('/user/login');
        return response;
      }
    });
  }

  async send(content: string, uri: string, headers?: Map<string, string> | undefined): Promise<[string | any, Error | null]> {
    let headersObj: Record<string, string> = {}
    if (headers) {
      headersObj
        = Array.from(new Set(headers))
          .reduce((res, nex) => {
            return {...res, [nex[0]]: nex[1]}
          }, {})
    }

    try {
      const res = await this.request(
        uri, 
        {
          method: 'POST',
          data: content,
          headers: headersObj
        }
      )    

      if (res.code === CODE_OK) {
        // login only here.
        if (uri === '/login') {
          if (res.data && res.data.token) {
            return [
              {
                token: res.data.token,
                uid: res.data.id,
                data: res
              },
              null
            ]
          }

          return ['', new Error(res.data.err_msg)]
        } 

        return [ new Json().toJson(res), null]
      }
          
      message.error({
        content: `${res.msg || '服务器异常，请稍后重试!'}`,
      });
      if (res.code === INVALID_TOKEN) {
        history.push('/user/login')
      }
  
      return [res, res.msg]
    } catch (error) {
      // bad resquest
      return ['', new Error()]
    }
  }

  setPusher(push: (data: string) => void): void {
    
  }
}

setStreamClientConstructor(Client)

const request = extend({
  credentials: 'include',
  timeout: 0,
  headers: {
    // 'Content-Type': 'application/json;charset=utf-8', // multipart/form-data
  },
  prefix: baseURL,
  // suffix: '.json'
})

export default request
// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

/**
 * 异常处理程序
 */
// const errorHandler = (error: { response: Response }): Response => {
//   const { response } = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;
//
//     notification.error({
//       message: `请求错误 ${status}: ${url}`,
//       description: errorText,
//     });
//   } else if (!response) {
//     notification.error({
//       description: '您的网络发生异常，无法连接服务器',
//       message: '网络异常',
//     });
//   }
//   return response;
// };

/**
 * 配置request请求时的默认参数
 */

// const request = extend({
//   // errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie\
//   timeout: 0,
//   headers: {
//     // 'Content-Type': 'application/json;charset=utf-8', // multipart/form-data
//   },
//   prefix: baseURL,
//   suffix: '.json', // 后缀
// });

// request.interceptors.request.use((url, options) => {
//   const currentLang = getLocale();
//   const token = localStorage.getItem('token');
//   if (options?.headers) {
//     // eslint-disable-next-line no-param-reassign
//     options.headers['lang'] = langMap[currentLang];
//     if (token) {
//       // eslint-disable-next-line no-param-reassign
//       options.headers['token'] = token;
//     }
//   }
//   return {
//     options: {
//       ...options,
//     },
//   };
// });

// response拦截器, 处理response
// request.interceptors.response.use(async (response) => {
//   const data = await response.clone().json();
//   if (response && response.status === CODE_OK) {
//     if (data.code === CODE_OK) {
//       return data.data;
//     }

//     message.error({
//       content: `${data.msg || '服务器异常，请稍后重试!'}`,
//     });
//     if (
//       data.code === CODE_UNAUTH ||
//       data.code === CODE_INVALID ||
//       data.code === CODE_INVALID_1 ||
//       data.code === INVALID_TOKEN
//     ) {
//       history.replace(`/user/login`);
//     } else {
//       throw new Error(data.msg);
//     }
//   } else {
//     const msgKeys = Object.keys(data.message);
//     const msgInfo = msgKeys.length
//       ? `${msgKeys[0]}: ${data.message[msgKeys[0]]}`
//       : '服务器异常，请稍后重试!';
//     message.error({
//       content: msgInfo,
//     });
//     // history.replace('/user/login');
//   }
//   return response;
// });

// export default request;
