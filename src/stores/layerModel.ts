import { message } from "antd";
import StrConfig from "../config/StrConfig";
import LayerService from "../services/LayerService";
import Config from "../config/Config";

interface Legend {
  id?: number;
  isOpen?: boolean;
  name: string;
  dataId?: { id?: number; children?: any[] }[];
  dot?: "arrow" | "circle" | "";
}
export interface Panel {
  id?: number;
  // title: string;
  isOpen: boolean;
  whethshare: boolean;
  icon: string;
  type: string;
  opacity: number;
  dataId: { id?: number; children?: any[] }[];
  legends: Legend[];
}
const defaultLegend: Legend = {
  isOpen: true,
  name: "",
  dataId: [],
  dot: ""
};
export const defaultPanel: Panel = {
  // title: "",
  isOpen: true,
  whethshare: false,
  icon: StrConfig.pptLayerOptions[0].icon,
  type: StrConfig.pptLayerOptions[0].value,
  opacity: 1,
  dataId: [],
  legends: [defaultLegend]
};
export default {
  namespace: "layerModel",
  state: {
    panels: [],
    count: 0,
    legendSource: []
    // { id: 1, title: "测试1", url: "/res/image/plan/1586828848356.xlsx" },
    // { id: 2, title: "测试2", url: "/res/image/plan/1586828848356.xlsx" }
  },
  effects: {
    *getList({ payload }, { call, put, select }) {
      console.log(payload);
      const _payload = payload || { page: 1, size: 10 };
      _payload.planId = Config.PLANID;
      const data = yield new Promise((resolve, reject) => {
        LayerService.getList(_payload, (flag, res) => {
          if (flag) resolve(res.data);
          else message.error(res.message), reject(0);
        });
      });
      const panels = data.list.map(e => {
        return {
          ...e,
          legends: e.legends.length ? e.legends : [defaultLegend]
        };
      });
      return yield put({
        type: "setProp",
        payload: { panels, count: data.count }
      });
    },
    *getListAll({ payload }, { call, put, select }) {
      const data = yield new Promise((resolve, reject) => {
        LayerService.getListAll({ planId: Config.PLANID }, (flag, res) => {
          if (flag) resolve(res.data);
          else message.error(res.message), reject(0);
        });
      });
      const panels = data.filter(e => e.isOpen || e.whethshare);
      return yield put({ type: "setProp", payload: { panels } });
    },
    *save({ payload: { i } }, { call, put, select }) {
      const { panels } = yield select(state => state.layerModel);
      const isAdd = panels[i].id ? 0 : 1;
      const payload = {
        ...(isAdd ? { planId: Config.PLANID } : {}),
        ...panels[i],
        dataId: JSON.stringify(panels[i].dataId),
        legends: JSON.stringify(panels[i].legends)
      };
      const data = yield new Promise((resolve, reject) => {
        LayerService[isAdd ? "add" : "update"](payload, (flag, res) => {
          if (flag) {
            message.success(res.message);
            resolve(res.data);
          } else {
            message.error(res.message);
            reject(0);
          }
        });
      });
      if (data) {
        return yield put({
          type: "_setPanelProp",
          payload: { i, id: data.id, legends: data.legends }
        });
      }
    },
    *del({ payload }, { call, put, select }) {
      const { i } = payload;
      const { panels, count } = yield select(state => state.layerModel);
      if (panels[i].id) {
        const flag = yield new Promise((resolve, reject) => {
          LayerService.del({ id: panels[i].id }, (flag, res) => {
            message[flag ? "success" : "error"](res.message);
            flag ? resolve(flag) : reject(flag);
          });
        });
        if (flag) {
          if (count > 1) {
            return Promise.resolve();
            // return yield put({
            //   type: "getList",
            //   payload: { page: Math.ceil((count - 1) / 10.0), size: 10 }
            // });
          } else {
            return yield put({ type: "removePanel", payload });
          }
        }
      } else yield put({ type: "removePanel", payload });
    },
    *delLegend({ payload }, { call, put, select }) {
      const { i, index } = payload;
      const { panels } = yield select(state => state.layerModel);
      const id = panels[i].legends[index].id;
      if (id) {
        const flag = yield new Promise((resolve, reject) => {
          LayerService.delLegend({ id }, (flag, res) => {
            message[flag ? "success" : "error"](res.message);
            flag ? resolve(flag) : reject(flag);
          });
        });
        flag && (yield put({ type: "removeLegend", payload }));
      } else return yield put({ type: "removeLegend", payload });
    },
    *setPanelProp({ payload }, { call, put, select }) {
      yield put({ type: "_setPanelProp", payload });
    },
    *setLegendProp({ payload }, { call, put, select }) {
      yield put({ type: "_setLegendProp", payload });
    }
  },
  reducers: {
    setProp(state, { payload: { ...rest } }) {
      return {
        ...state,
        ...(typeof rest === "object" ? JSON.parse(JSON.stringify(rest)) : rest)
      };
    },
    _setPanelProp(state, { payload: { i, ...rest } }) {
      let key; // when panel[key] is Object
      return {
        ...state,
        panels: state.panels.map((item, index) => {
          if (i !== index) {
            // 非当前面板不变
            return item;
          } else if (rest.type) {
            return { ...item, ...rest, legends: [defaultLegend] };
          } else if (
            (key = Object.keys(rest).find(
              k =>
                Object.prototype.toString.call(rest[k]) === "[object Object]" &&
                Object.prototype.toString.call(item[k]) === "[object Object]"
            ))
          ) {
            // 更改面板里对象, 如 rest = { fontVo: { size: 14} }
            return { ...item, [key]: { ...item[key], ...rest[key] } };
          } else return { ...item, ...rest };
        })
      };
    },
    addPanel(state) {
      let panels = state.panels;
      panels.unshift({
        ...defaultPanel,
        dataId: [...defaultPanel.dataId],
        legends: [defaultLegend]
      });
      return { ...state, panels: [...panels], count: state.count + 1 };
    },
    removePanel(state, { payload: { i } }) {
      const panels = [...state.panels];
      console.log(panels);
      panels.splice(i, 1);
      return { ...state, panels: [...panels], count: state.count - 1 };
    },
    addLegend(state, { payload: { i } }) {
      let panels = state.panels;
      panels[i].legends.push(defaultLegend);
      return { ...state, panels: [...panels] };
    },
    removeLegend(state, { payload: { i, index } }) {
      let panels = state.panels;
      panels[i].legends.splice(index, 1);
      if (!panels[i].legends.length) {
        panels[i].legends = [defaultLegend];
      }
      return { ...state, panels: [...panels] };
    },
    _setLegendProp(state, { payload: { i, index, ...rest } }) {
      return {
        ...state,
        panels: state.panels.map((panel, idx) =>
          i !== idx
            ? panel
            : {
                ...panel,
                legends: panel.legends.map((e, idx2) =>
                  idx2 !== index ? e : { ...e, ...rest }
                )
              }
        )
      };
    }
  }
};
// '[{id:111},{id:112, sub:{id:1110}}]'
