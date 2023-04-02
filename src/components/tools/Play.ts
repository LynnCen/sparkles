import Config from "../../config/Config";
import { message } from "antd";
import app from "../../index";
import { videoMetadata } from "../../utils/common";
import { Animation, Model, Terrain, Mark, PipeLine, Geometry, Push } from "../model/";
import ShowData from "./showData";
import Handle from "./Handle";
import Tools from "./Tools";
const { maps, vrPlanner } = Config;

export default class Play {
  private static data: { [key: string]: any[] };
  static features: { time; dataId; type; id; data }[] = [];
  static INDEX: number = 0;
  static timer: NodeJS.Timeout | 0;
  static isFeatureValid = feature =>
    feature &&
    (feature.type == "clear" ||
      (feature.dataId && feature.dataId.length) ||
      (feature.data && feature.data.length));

  static play(features, initState = false) {
    if (!this.data) this.init();
    this.features = features;
    const camera = maps.getCamera();
    if (/share/.test(location.href) && camera.isMoving()) {
      // 分享页按pgUp, pgDn先暂停
      const position = camera.getPosition();
      const lookAt = camera.getLookAt();
      camera.setPosition(position, lookAt);
    }
    this.INDEX = 0;
    clearTimeout(this.timer as NodeJS.Timeout);
    if (this.features.length) {
      !initState && this.featureState(initState);
      if (this.isFeatureValid(this.features[0])) {
        this.analysisData(this.features[0]);
      } else process.env.NODE_ENV != "production" && message.warn(`暂无数据`);
      this.timer = setTimeout(
        () => this.timeout(),
        typeof this.features[this.INDEX].time === "number"
          ? this.features[this.INDEX].time * 1000
          : 0
      );
    }
  }
  static timeout() {
    this.INDEX++;
    clearTimeout(this.timer as NodeJS.Timeout);
    if (this.INDEX === this.features.length) {
      this.features = [];
      this.INDEX = 0;
      !/share/.test(location.href) && Play.featureState(true);
    } else {
      let i = this.INDEX % this.features.length;
      if (this.isFeatureValid(this.features[i])) {
        this.analysisData(this.features[i]);
      } else
        process.env.NODE_ENV != "production" && message.warn(`第${this.INDEX + 1}个动画元素为空！`);
      this.timer = setTimeout(
        () => this.timeout(),
        typeof this.features[this.INDEX].time === "number"
          ? this.features[this.INDEX].time * 1000
          : 0
      );
    }
  }
  private static init() {
    this.data = {
      balloon: Mark.marks,
      build: Model.models,
      line: PipeLine.pipes,
      area: Geometry.geometrys,
      push: Push.pushs,
      terrain: Terrain.terrains,
      animateline: Animation.animations,
      cad: []
    };
    if (app && !this.data.cad.length) {
      this.data.cad = app._store.getState().cadModel.panels;
    }
  }
  static analysisData(item) {
    if (item) {
      if (item.type === "view") {
        if (item.data.length > 0) {
          const timeTrans = new vrPlanner.Transition(
            typeof item.time === "number" ? item.time || 0.1 : 0.1,
            vrPlanner.Interpolation.CubicBezier.EASE
          );
          const position = ShowData.getGeo(item.data[0].position);
          const lookAt = ShowData.getGeo(item.data[0].lookAt);
          if (position && lookAt) maps.getCamera().flyTo(position, lookAt, true, timeTrans);
          else message.error("视角数据错误");
        } else message.warning("当前步骤暂未添加视角");
      } else if (item.type === "clear") {
        this.features.slice(0, this.INDEX).forEach(f => this.setFeatureVisible(f, false));
      } else {
        this.setFeatureVisible(item, true);
      }
    }
  }
  static featureState(isShow, terrainIds?: number[]) {
    let trIds;
    if (terrainIds) trIds = terrainIds;
    else
      trIds = this.features
        .filter(e => e.type === "terrain")
        .reduce((r, c) => {
          r.push(...(c.dataId || []));
          return r;
        }, []);
    for (const key in Play.data) {
      Play.data[key].forEach(item => {
        if (key == "terrain") {
          if (trIds.includes(item.id)) {
            item.setVisible(isShow);
          }
        } else if (key === "cad") {
          if (!isShow) {
            const { attr, layer } = item.data;
            const { font, line, block } = attr;
            for (const _k in layer.font) {
              const feature = layer.font[_k];
              feature.setVisible(Boolean(font.isShare));
            }
            for (const _k in layer.line) {
              const feature = layer.line[_k];
              feature.setVisible(Boolean(line.isShare));
            }
            for (const _k in layer.block) {
              const feature = layer.block[_k];
              feature.setVisible(Boolean(block.isShare));
            }
          } else {
            item.data.setVisible(isShow);
          }
        } else if (key === "animateline") {
          item.setAnimation("finish");
          item.setVisible(isShow);
        } else {
          item.setVisible(isShow || item.whethshare || false);
        }
        if (isShow) {
          // isShow == true only when PPT/FatherMenu call
          if (item.type === "balloon") {
            item.showBalloonData(true);
          }
          if (item.type === "build" || item.type === "area") item.active();
        } else {
          if (item.type === "area") if (!item.whethshare) item.setHeight(1);
        }
      });
    }
    Tools.setPPTDayNight(0);
    Tools.setPipeline();
    Tools.setSun();
  }
  static setFeatureVisible(item, isShow: boolean) {
    let { type, dataId = [], time } = item;
    dataId = dataId || [];
    if (!this.data) this.init();
    if (item.type == "view") return Handle.stopCamera();
    if (/pic|video|link/.test(item.type)) {
      if (isShow) {
        let url = dataId.length ? dataId[0] : "";
        url = /^https?\:\/\//.test(url) ? url : Config.apiHost + url;
        const w = document.body.clientWidth;
        const area = ["60%", "fit-content"];
        const openLayer = () =>
          window["layer"].open({
            type: item.type == "pic" ? 1 : 2,
            title: " ",
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            skin: "layui-layer-share", //样式类名
            area,
            content: item.type == "pic" ? `<img src=${url} style="margin: 0 auto;"/>` : url,
            success: (a, i) => {
              console.log(a, i);
            },
            full: layero => {
              if (layero.find("iframe").length)
                layero.find("iframe")[0].style.height = window.innerHeight - 54 + "px";
            },
            restore: layero => {
              if (layero.find("iframe").length) layero.find("iframe")[0].style.height = 500 + "px";
            }
          });
        if (item.type == "pic") {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            area[0] = Math.min(w * 0.56, Math.max(100, img.width)) + "px";
            area[1] = Math.min(w * 0.56, img.width) / (img.width / img.height) + 42 + "px";
            openLayer();
          };
        } else if (item.type == "video") {
          videoMetadata(url)
            .then(({ videoWidth, videoHeight }) => {
              area[1] = (w - 840) / ((videoWidth / videoHeight) * 1.0) + "px";

              openLayer();
            })
            .catch(message.error);
        } else openLayer();
      } else {
        self["layer"].closeAll();
      }
    } else if (item.type === "night") {
      Tools.setPPTDayNight(dataId[0]);
    } else if (item.type === "shadow") {
      Tools.setShadowOpacity(dataId[0]);
    } else if (item.type === "sun") {
      Tools.simulateSun(dataId);
    } else if (Object.keys(Play.data).includes(type)) {
      if (type == "balloon") {
        Mark.marks.forEach(
          e =>
            e.whethshare &&
            (Array.isArray(dataId) ? !dataId.includes(e.id) : e.id != dataId) &&
            e.showBalloonData(true)
        );
      }
      Play.data[type] &&
        Play.data[type].forEach(feature => {
          if ((Array.isArray(dataId) && dataId.includes(feature.id)) || dataId == feature.id) {
            if (feature.type === "animation") {
              feature.setVisible(isShow);
              feature.line.setVisible(false); //手绘模拟线不显示
              if (isShow) {
                feature.setPlay();
              } else {
                feature.setAnimation("finish");
              }
            } else {
              if (item.type === "cad") {
                feature.data.setVisible(isShow);
              } else {
                feature.setVisible(isShow);
              }
              if (feature.type != "balloon" && feature.active && isShow) {
                feature.active(time);
              }
            }
          }
        });
    }
  }
  static preview(menuList, index?: number) {
    // console.log(menuList, index)
    if (typeof index === "number") {
      this.play(menuList[index].feature);
      // this.featureState(true);
    } else if (menuList.length) {
      let times = menuList.map((m, i) => m.feature.reduce((total, f) => total + f.time, 0));
      let delays = times.map((e, i) =>
        times.slice(0, i + 1).reduce((total, num) => total + num, 0)
      );
      delays.pop();
      delays.unshift(0);
      menuList.forEach((m, i) =>
        setTimeout(() => {
          this.preview(menuList, i);
        }, delays[i] * 1000)
      );
    }
  }
}
