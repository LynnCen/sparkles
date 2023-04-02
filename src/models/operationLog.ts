import { Effect, Reducer } from 'umi';
import { queryList } from '@/pages/OperationLog/service';

export interface OperationLogType {
  ip: string;
  itime: number;
  method: string;
  staff: string;
  status: number;
  url: string;
  _id: string;
}

export interface OperationLogModelState {
  list?: OperationLogType[];
}

export interface UserModelType {
  namespace: 'operationLog';
  state: OperationLogModelState;
  effects: {
    fetch: Effect;
  };
  reducers: {
    saveCurrentList: Reducer<OperationLogModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'operationLog',

  state: {
    list: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'saveCurrentList',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentList(state, action) {
      return {
        ...state,
        list: action.payload || {},
      };
    },
  },
};

export default UserModel;
