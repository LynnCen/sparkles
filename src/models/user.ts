import { Effect, Reducer } from 'umi';

import { queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
// import { AccessItem } from './data';
import { getAllAuths } from '@/utils/permissionTreeHelper';
import userspace from '@/userspace';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
  id?: string;
  username?: string;
  is_admin?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const filterAccess =  (access) => {

  return access.filter(item => {

    if (item.children && item.children.length > 0) {
      item.children = filterAccess(item.children)
      if (item.children.length === 0) {
        return false
      }
    }

    if (item.permission && item.permission.length > 0) {
      const hasPermission = item.permission.find(item => item.is_select === 1)
      
      if (!hasPermission) {
        return false
      } else {
        return true
      }
    }

    return true
  })
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const init = userspace.current?.init.bind(userspace.current)
      yield call(init)
      
      const response = yield call(queryCurrent);

      if (response) {
        const [data, err] = response
        if (!err) {
          yield put({
            type: 'saveCurrentUser',
            payload: data,
          });
          const { access } = data;
          setAuthority(getAllAuths(filterAccess(access) || []), localStorage.getItem('System')||'');
        }
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {

      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
