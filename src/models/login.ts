// import { stringify } from 'querystring';
import { history, Reducer, Effect, Subscription } from 'umi';

import { accountLogin, accountLogout } from '@/services/login';
import { queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import userspace, { setUserSpace } from '@/userspace';
import { LoginEvent } from '@/userspace/eventClass';
import type { EventClass } from '@/ts_pkc/ts-nc/src/event';
import { Token, TokenItem } from '@/ts_pkc/ts-baselib/src/db/token';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  currentUser?: Record<string, any>;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
  subscriptions: Record<string, Subscription>
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try { 
        const [response, err] = yield call(accountLogin, ...payload ); 

        if (err) {
          message.error(err.message)
          return;
        }

        const {us, data: res} = response
        setUserSpace(us)

        const getToken = userspace.current?.nf.get('main').getToken.bind(userspace.current?.nf.get('main'))
        const token = yield call(getToken)
        localStorage.setItem('token', token)
        // login no info returns. so we get info here
        // const res = yield call(queryCurrent)
            
        yield put({
          type: 'changeLoginStatus',
          payload: res.data,
        });

        localStorage.setItem('System', 'Sys_RoleAdm');
        localStorage.setItem('umi_locale', 'zh-CN');
        history.push(`/`);
      } catch (_) {
        return;
      }

      // Login successfully
      // const urlParams = new URL(window.location.href);
      // const params = getPageQuery();
      // let { redirect } = params as { redirect: string };
      // if (redirect) {
      //   const redirectUrlParams = new URL(redirect);
      //   if (redirectUrlParams.origin === urlParams.origin) {
      //     redirect = redirect.substr(urlParams.origin.length);
      //     if (redirect.match(/^\/.*#/)) {
      //       redirect = redirect.substr(redirect.indexOf('#') + 1);
      //     }
      //   } else {
      //     window.location.href = '/';
      //     return;
      //   }
      // }
      // history.replace(redirect || '/');
    },

    *logout({payload}, { call }) {
      const { redirect } = getPageQuery();
      yield call(accountLogout);
      localStorage.setItem('token', '');

      // delete userinfo from slefDB
      const tabel = userspace.current?.selfDB.table(`token`, TokenItem, Token)
      if (tabel) {
        const delAll = tabel.delAll.bind(tabel)
        yield call(delAll)
      }
      
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { access } = payload;  
      
      // @ts-ignore
      const currentAuthority = Array.from(access, (item) => item.key);      
      
      // 这里设置权限的字符串， 在后面的路由处判断
      setAuthority(currentAuthority, localStorage.getItem('System')||'');
      return {
        ...state,
        status: payload.id,
        currentUser: payload,
        type: payload.type,
      };
    },
  },

  subscriptions: {
    setup({dispatch}) {
  
      if(userspace.current) { 
        const us = userspace.current;   

        us.nc.addObserver(
          Symbol('login'), 
          LoginEvent as EventClass<string, LoginEvent> ,
          (e) => {
            const data = e.getData()
            dispatch({
              type: data.type,
              payload: data.payload
            })
          }
        )

      }
    }
  }
};

export default Model;
