import { message } from "antd";
import Config from "../config/Config";
import StrConfig from "../config/StrConfig";

export default {
  namespace: "commonModel",
  state: {
    terrainList: []
    // cad: {}
  },
  effects: {
    *setProp({ payload }, { call, put, select }) {
      yield put({ type: "_setProp", payload });
    }
  },
  reducers: {
    _setProp(state, { payload: { ...rest } }) {
      return { ...state, ...rest };
    }
  }
};
