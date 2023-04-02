import userspace from '@/userspace';

import type { Effect, Reducer, Action, Subscription } from 'umi';
import type { ReUserSpace } from '@/ts_pkc/ts-baselib';

export interface UserSpaceState {
  us: ReUserSpace | null;
}

export interface UserSpaceType {
  namespace: 'userspace';
  state: UserSpaceState;
  effects: {
    createUserSpace: Effect;
  };
  reducers: {
    setUserSpace: Reducer<UserSpaceState>;
    // updateUserSpace: Reducer<UserSpaceState>,
  };
  subscriptions: Record<string, Subscription>;
}

const UserSpace: UserSpaceType = {
  namespace: 'userspace',
  state: {
    us: null,
  },
  effects: {
    *createUserSpace(action, { put }) {
      // const
      put({
        type: 'userspace/setUserSpace',
        payload: action.payload,
      });
    },
  },
  reducers: {
    setUserSpace: (state, action) => {
      return {
        ...state,
        us: action.payload,
      };
    },
    // updateUserSpace: () => {}
  },
  subscriptions: {
    setup: ({ dispatch }) => {
      
      if (userspace) {
        // userspace.nc.addObserver()
      }
    },
  },
};

export default UserSpace;
