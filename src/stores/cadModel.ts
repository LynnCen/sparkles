import { message } from "antd";
import Config from "../config/Config";
import CADService from "../services/CadService";
import { CadModuleData } from "../components/model/CAD";

export interface CadFileDto {
  id: number;
  type: string;
  fileName: string;
  jsonUrl: string;
}
export interface CadSourceDto {
  id: number;
  type: string;
  title: string;
  coordinate: string;
  cadFileVoList: Array<CadFileDto>;
}
export interface Panel {
  data: CadModuleData;
  cads?: string; // 提交query: cad ids
  cadFiles?: string; // 提交query: cadFile ids

  id?: number;
  title: string;
  isShow: number;
  position: number[];
  lookAt: number[];
  list: CadSourceDto[]; // 暂存已选数据源项

  fontVo: {
    size: number;
    color: string;
    altitude: number;
    iconUrl: string;
    iconIsShow: number;
    isShare: number;
  };
  lineVo: {
    isDepth: number;
    isLevel: number;
    style: string;
    width: number;
    altitude: number;
    color: string;
    isShare: number;
  };
  blockVo: {
    isLevel: number;
    height: number;
    altitude: number;
    opacity: number;
    color: string;
    isShare: number;
  };
}
export const defaultPanel: Panel = {
  cads: "",
  cadFiles: "",
  list: [],
  data: new CadModuleData({
    position: [],
    lookAt: [],
    list: []
  }),
  title: "未命名",
  isShow: 1,
  position: [],
  lookAt: [],
  fontVo: {
    size: 14,
    color: "#fff",
    altitude: 25,
    iconUrl: "/res/image/icon/admin/21971565344686676.jpg",
    iconIsShow: 1,
    isShare: 0
  },
  lineVo: {
    isDepth: 1,
    isLevel: 0,
    style: "flat2d",
    width: 1,
    altitude: 0,
    color: "#fff",
    isShare: 0
  },
  blockVo: {
    isLevel: 0,
    height: 1,
    altitude: 0,
    opacity: 1,
    color: "#7ED321",
    isShare: 0
  }
};
const _keys = ["panels", "backups"];
// export const config = {
//   panel: defaultPanel
// };
export default {
  namespace: "cadModel",
  state: {
    panels: [],
    backups: [],
    cadSource: [] // CadSourceDto
  },
  effects: {
    *getFormatListForShare({ payload: { planId } }, { call, put, select }) {
      const data = yield new Promise((resolve, reject) => {
        CADService.getFormatListForShare({ planId }, (flag, res) => {
          if (flag) resolve(res.data);
          else message.error(res.message);
        });
      });
      const panels = data.list
        .map(e => {
          let position = [],
            lookAt = [];
          try {
            position = JSON.parse(e.position);
            lookAt = JSON.parse(e.lookAt);
          } catch (e) {
            console.warn(e);
          }
          return { ...e, position, lookAt };
        })
        .sort((a, b) => b.id - a.id);
      yield put({
        type: "setProp",
        payload: { panels, backups: panels }
      });
    },
    *getFormatList({ payload }, { call, put, select }) {
      const _payload = payload || {};
      if (!_payload.planId) {
        _payload.planId = Config.PLANID;
      }
      const data = yield new Promise((resolve, reject) => {
        CADService.getFormatList(_payload, (flag, res) => {
          if (flag) resolve(res.data);
          else message.error(res.message);
        });
      });
      const panels = data.list
        .map(e => {
          let position = [],
            lookAt = [];
          try {
            position = JSON.parse(e.position);
            lookAt = JSON.parse(e.lookAt);
          } catch (e) {
            console.warn(e);
          }
          return { ...e, position, lookAt };
        })
        .sort((a, b) => b.id - a.id);
      yield put({
        type: "setProp",
        payload: { panels, backups: panels }
      });
    },
    *saveFormat({ payload: { i } }, { call, put, select }) {
      const { panels, backups } = yield select(state => state.cadModel);
      const list: CadSourceDto[] = [...panels[i].list];
      const cads = [];
      let cadFiles = [];
      list.forEach(c => {
        let files = c.cadFileVoList.map(f => f.id);
        if (files.length) {
          cadFiles = cadFiles.concat(files);
          cads.push(c.id);
        }
      });
      const form = ["fontVo", "lineVo", "blockVo"].reduce(
        (r, c) => (
          Object.entries(panels[i][c]).forEach(([k, v]) => {
            r[c.slice(0, -2) + k.charAt(0).toUpperCase() + k.slice(1)] = v;
          }),
          r
        ),
        {}
      );
      const isAdd = panels[i].id ? 0 : 1;
      const data = {
        ...(isAdd ? { planId: Config.PLANID } : { id: panels[i].id }),
        title: panels[i].title,
        isShow: 1,
        position: JSON.stringify(panels[i].position),
        lookAt: JSON.stringify(panels[i].lookAt),
        cads: cads.join(","),
        cadFiles: cadFiles.join(","),
        ...form
      };
      const id = yield new Promise((resolve, reject) => {
        CADService[`${isAdd ? "add" : "update"}Format`](data, (flag, res) => {
          if (flag) {
            message.success(res.message);
            panels[i].data.save(panels[i]);
            resolve(res.data);
          } else {
            message.error(res.message);
            return;
          }
        });
      });
      // isAdd && (yield put({ type: "getFormatList" }));
      if (isAdd && id) {
        yield put({
          type: "_setPanelProp",
          payload: { i, id }
        });
        CadModuleData.addData(panels[i].data);
        backups.push({ id, ...panels[i] });
      }
      yield put({
        type: "setProp",
        payload: {
          backups: backups.map(e => (e.id !== panels[i].id ? e : panels[i]))
        }
      }); //保存同步到备份
    },
    *deleteFormat({ payload }, { call, put, select }) {
      const { i } = payload;
      const { panels } = yield select(state => state.cadModel);
      if (panels[i].id) {
        yield new Promise((resolve, reject) => {
          CADService.deleteFormat(panels[i].id, (flag, res) => {
            if (flag) {
              message.success(res.message);
              resolve();
            } else {
              message.error(res.message);
              return;
            }
          });
        });
      }
      yield put({ type: "removePanel", payload });
    },
    *getSelectionList({ payload }, { call, put, select }) {
      const cadSource = yield new Promise((resolve, reject) => {
        CADService.getSelectionList(
          { planId: Config.PLANID, ...(payload || {}) },
          (flag, res) => {
            if (flag) resolve(res.data.list);
            else message.error(res.message);
          }
        );
      });
      yield put({ type: "setProp", payload: { cadSource } });
    },
    *setPanelProp({ payload }, { call, put, select }) {
      yield put({ type: "_setPanelProp", payload });
    },
    *cancelEdit({ payload }, { call, put, select }) {
      yield put({ type: "_cancelEdit", payload });
    }
  },
  reducers: {
    setProp(state, { payload: { ...rest } }) {
      if (
        _keys.find(k => k in rest && rest[k].length && "data" in rest[k][0])
      ) {
        const keys = Object.keys(rest);
        let datas = new Array(keys.length).fill([]);
        keys.forEach((k, i) =>
          rest[k].forEach((e, j) => datas[i].push(e.data))
        );
        return keys.reduce(
          (s, k, i) => (
            (s[k] = [
              ...JSON.parse(
                JSON.stringify(rest[k], (key, v) =>
                  key == "data" ? undefined : v
                )
              ).map((e, j) => ((e.data = datas[i][j]), e))
            ]),
            s
          ),
          { ...state }
        );
      } else
        return {
          ...state,
          ...(typeof rest === "object"
            ? JSON.parse(JSON.stringify(rest))
            : rest)
        };
    },
    _setPanelProp(state, { payload: { i, ...rest } }) {
      // const keys = ["cadId", "cadFileId", "selected"];
      let key; // when panel[key] is Object
      return {
        ...state,
        panels: state.panels.map((item, index) => {
          if (i !== index) {
            // 非当前面板不变
            return item;
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
        title: defaultPanel.title + (panels.length + 1)
      });
      return { ...state, panels: [...panels] };
    },
    removePanel(state, { payload: { i } }) {
      const panels = [...state.panels];
      const backups = [...state.backups];
      panels.splice(i, 1);
      backups.splice(i, 1);
      return { ...state, panels: [...panels], backups: [...backups] };
    },
    _cancelEdit(state, { payload: { i } }) {
      let panels = state.panels;
      let data;
      let panel = JSON.parse(
        JSON.stringify(state.backups[i], (k, v) =>
          k == "data" ? ((data = v), undefined) : v
        )
      );
      panels[i] = { ...panel, data };
      return { ...state, panels: [...panels] };
    }
  }
};
