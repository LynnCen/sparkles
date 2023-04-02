import DataService from "../services/DataService";
import { message } from "antd";
import SurveryService from "../services/SurveyService";

export interface Panel {
  id?: number | null;
  planDataId?: number | null;
  type: string;
  name: string;
  icon: string;
  items:
    | [
        {
          id?: number | null;
          itemName: string;
          color: string;
          showLarge: boolean;
          source: string;
          unit: string;
          chart: string;
          showAllData: boolean;
          min: number | null;
          max: number | null;
        }
      ]
    | null;
  str: string | null;
}

export const config = {
  panel: {
    type: "",
    name: "未命名",
    icon: "",
    items: [],
    str: ""
  },
  panelTypes: {
    monitorData: {
      name: "监测数据",
      // item: [
      //   { name: "dataName", value: "" },
      //   { name: "color", value: "" },
      //   { name: "showLarge", value: false },
      //   { name: "source", value: "" },
      //   { name: "unit", value: "" },
      //   { name: "chart", value: "" },
      //   { name: "showAllData", value: false },
      //   { name: "min", value: 5 },
      //   { name: "max", value: 20340 }
      // ]
      item: {
        itemName: "",
        color: "#F5A623",
        showLarge: false,
        source: "",
        unit: "",
        chart: "",
        showAllData: false,
        min: 0,
        max: 100
      }
    },
    photo: {
      name: "图片展示",
      item: {
        name: "图片",
        value: ""
      }
    },
    text: {
      name: "文字展示",
      item: {
        name: "文字",
        value: ""
      }
    },
    monitor: {
      name: "监控展示",
      item: {
        name: "监控源",
        value: ""
      }
    },
    video: {
      name: "视频展示",
      item: {
        name: "视频",
        value: ""
      }
    },
    externalLink: {
      name: "外链展示",
      item: {
        name: "外链",
        value: ""
      }
    }
  }
};

function updateObj(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}

function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      return item;
    }
    const updatedItem = updateItemCallback(item);
    return updatedItem;
  });

  return updatedItems;
}

export default {
  namespace: "markerModel",
  state: {
    id: null, // Content id
    planDataId: null, // Mark id
    altitude: 10,
    panels: [],
    backups: [],
    surveyList: [],
    surveyListCount: 0
  },

  effects: {
    *getPlanDataTabs({ payload }, { call, put, select }) {
      const { planDataId } = payload;
      let data = yield DataService.getPlanDataTabs({ planDataId }).then(
        r => r.data
      );
      let panels = (data.length ? data : [config.panel]).map(e =>
        e.type === "monitorData"
          ? {
              ...e,
              items: e.items.length
                ? e.items
                : [config.panelTypes["monitorData"].item]
            }
          : e
      );
      yield put({
        type: "setProp",
        payload: {
          i: 0,
          planDataId: payload.planDataId,
          panels,
          backups: panels
        }
      });
    },
    *savePlanDataTab({ payload: { i, planDataId } }, { call, put, select }) {
      const { panels } = yield select(state => state.markerModel);
      const data = { tabs: JSON.stringify({ ...panels[i], planDataId }) };
      const tabId = yield new Promise((resolve, reject) => {
        DataService.savePlanDataTab(data, (flag, res) => {
          if (flag) {
            message.success(res.message);
            resolve(res.data);
          } else message.error(res.message);
        });
      });
      yield put({
        type: "getPlanDataTabs",
        payload: { planDataId, tabId }
      });
    },
    *delPlanDataTab({ payload }, { call, put, select }) {
      const { i, type } = payload;
      const { panels } = yield select(state => state.markerModel);
      const data: { [key: string]: any } = {};
      // 是否已有数据
      if (panels[i].id) {
        if (
          ("index" in payload &&
            ((data.subId = panels[i].items[payload.index].id), data.subId)) ||
          (!("index" in payload) && (data.id = panels[i].id))
        )
          yield new Promise((resolve, reject) => {
            DataService.delPlanDataTab(data, (flag, res) => {
              if (flag) {
                message.success(res.message);
                resolve();
              } else message.error(res.message);
            });
          });
      }
      yield put({
        type:
          type == "monitorData" && "index" in payload
            ? "removeCard"
            : "removePanel",
        payload
      });
    },
    *getSurveyList({ payload }, { call, put, select }) {
      let data = yield new Promise((resolve, reject) => {
        SurveryService.getListByPlanId(payload, (flag, res) => {
          if (flag) {
            resolve(res.data);
          } else message.error(res.message);
        });
      });
      if (data.count) {
        data.list.forEach(e => e.type && delete e.type);
        yield put({
          type: "setProp",
          payload: { surveyList: data.list, surveyListCount: data.count }
        });
      }
    },
    *getContentTabs({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.markerModel);
      let data = [];
      if (payload.id) {
        data = yield DataService.getContentTabs({ id: payload.id }).then(
          r => r.data
        );
        if (!id) yield put({ type: "setProp", payload });
      }
      let panels = data.length ? data : [config.panel];
      yield put({
        type: "setProp",
        payload: {
          panels: panels.map(e =>
            e.type === "monitorData"
              ? {
                  ...e,
                  items: e.items.length
                    ? e.items
                    : [config.panelTypes["monitorData"].item]
                }
              : e
          )
        }
      });
    },
    *saveContentTab({ payload: { i } }, { call, put, select }) {
      const { panels, id } = yield select(state => state.markerModel);
      const data = { id, tab: JSON.stringify(panels[i]) };
      const tabId = yield new Promise((resolve, reject) => {
        DataService.saveContentTab(data, (flag, res) => {
          if (flag) {
            message.success(res.message);
            resolve(res.data);
          } else message.error(res.message);
        });
      });
      console.log(tabId);
      yield put({ type: "getContentTabs", payload: { id, tabId } });
    },
    *delContentTab({ payload }, { call, put, select }) {
      const { i, type } = payload;
      const { id, panels } = yield select(state => state.markerModel);
      const data: { [key: string]: any } = {};
      // 是否已有数据
      if (panels[i].id) {
        if (
          ("index" in payload &&
            ((data.subId = panels[i].items[payload.index].id), data.subId)) ||
          (!("index" in payload) && (data.tabId = panels[i].id))
        )
          yield new Promise((resolve, reject) => {
            DataService.delContent(data, (flag, res) => {
              if (flag) {
                message.success(res.message);
                resolve();
              } else message.error(res.message);
            });
          });
      }
      yield put({
        type:
          type == "monitorData" && "index" in payload
            ? "removeCard"
            : "removePanel",
        payload
      });
    },
    *removePanels({ payload }, { call, put, select }) {
      yield put({ type: "_removePanels", payload });
    }
  },

  reducers: {
    //https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns#updating-an-item-in-an-array
    setProp(state, { payload: { ...rest } }) {
      return { ...state, ...rest };
    },
    setPanelProp(state, { payload: { i, ...rest } }) {
      return {
        ...state,
        panels: state.panels.map((item, index) =>
          i !== index ? item : { ...item, ...rest }
        )
      };
    },
    setPanelType(state, { payload: { i, value } }) {
      return {
        ...state,
        panels: state.panels.map((item, index) => {
          if (i !== index) return item;
          else {
            let obj: any = { type: value, items: [], str: "" };
            if (value == "monitorData") {
              obj.items.push(config.panelTypes[value].item);
            }
            return { ...item, ...obj };
          }
        })
      };
    },
    addPanel(state) {
      let panels = state.panels;
      panels.push(config.panel);
      return { ...state, panels };
    },
    setPanel(state, { payload: { i, panel } }) {
      let panels = state.panels;
      let backups = state.backups;
      panels.splice(i, 1, panel);
      backups.splice(i, 1, panel);
      return { ...state, panels: [...panels], backups: [...backups] };
    },
    removePanel(state, { payload: { i } }) {
      let panels = state.panels;
      let backups = state.backups;
      panels.splice(i, 1);
      backups.splice(i, 1);
      return {
        ...state,
        panels: panels.length ? [...panels] : [config.panel],
        backups: [...backups]
      };
    },
    _removePanels(state, { payload: { filter } }) {
      let panels = state.panels;
      let i;
      for (i = 0; i < panels.length; i++) {
        if (filter(panels[i])) {
          panels.splice(i, 1);
          i--;
        }
      }
      return {
        ...state,
        panels: panels.length ? [...panels] : [config.panel]
      };
    },
    // setPanels(state, { payload: [...panels] }) {
    //   return { ...state, panels };
    // },
    addCard(state, { payload: { i } }) {
      let panels = state.panels;
      panels[i] = {
        ...panels[i],
        items: [...panels[i].items, config.panelTypes["monitorData"].item]
      };
      return { ...state, panels };
    },
    removeCard(state, { payload: { i, index } }) {
      let panels = state.panels;
      let backups = state.backups;
      panels[i].items.splice(index, 1);
      panels[i] = backups[i] = {
        ...panels[i],
        items: panels[i].items.length
          ? [...panels[i].items]
          : [config.panelTypes["monitorData"].item]
      };
      return { ...state, panels };
    },
    setDataProp(state, { payload: { i, index, ...rest } }) {
      return {
        ...state,
        panels: state.panels.map((panel, idx) =>
          i !== idx
            ? panel
            : {
                ...panel,
                items: panel.items.map((item, idx2) =>
                  idx2 !== index ? item : { ...item, ...rest }
                )
              }
        )
      };
    },
    setSurveyProp(state, { payload: { i, ...rest } }) {
      return {
        ...state,
        surveyList: state.surveyList.map((item, index) =>
          i !== index ? item : { ...item, ...rest }
        )
      };
    }
  }
};
