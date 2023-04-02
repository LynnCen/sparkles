import Config from "../../config/Config";
import Point from "./Point";
import DataService from "../../services/DataService";
import ReactDOM from "react-dom";
import React from "react";
import ShareService from "../../services/ShareService";
import Play from "../tools/Play";
import MarkerBoxModal from "../../modules/Modal/MarkerBoxModal";
import { message } from "antd";
import Tools from "../tools/Tools";
import { render } from "../../utils/common";
import labelBackground from '../../assets/module-selected.svg'
import SyPopup from "../../modules/Share/Components/SyPopup";
import LdPopup from "../../modules/Share/skin/lianDuPolice/LdPopup";

const { maps, vrPlanner } = Config;
export default class Mark extends Point {
  id: number;
  title: string;
  visible: boolean;
  fontFamily: string;
  fontSize: number;
  fontItalic: boolean;
  fontColor: string;
  line: any;
  icon: string;
  height: number;
  iconVisible: boolean;
  iconType: string;
  titleVisible: boolean;
  contents: Content[] = [];
  contentId: number[];
  balloon: any;
  lineVisible: boolean;
  showMessage: boolean;
  cameraLook: any;
  cameraPosition: any;
  code: string;
  bottom: number;
  subMenuId: number | undefined;
  className: string = "";
  static marks: Mark[] = [];
  isCustom: boolean;
  isLdShare: boolean;

  constructor({
    geo,
    cameraPosition = "",
    cameraLook = "",
    title = "标签",
    visible = true,
    fontFamily = "unset",
    fontSize = 16,
    fontItalic = false,
    fontColor = "",
    icon = "/res/image/icon/admin/22011565592416553.png",
    height = 0,
    iconVisible = true,
    iconType = "1",
    titleVisible = true,
    lineVisible = true,
    contentId = [],
    whethshare = false,
    id = 0,
    code = "",
    subMenuId = undefined,
    className = "",
    altitudeMode = vrPlanner.Feature.ALTITUDE_MODE_ABSOLUTE,
    isCustom = false,
    isLdShare = false
  }) {
    super({ geo, pointStyle: "mark", whethshare });
    this.isLdShare = isLdShare;
    this.type = "balloon";
    this.cameraPosition = cameraPosition;
    this.cameraLook = cameraLook;
    this.point = new Config.vrPlanner.Feature.Point(
      geo.add(new Config.vrPlanner.Math.Double3(0, 0, height))
    );
    this.point.setStyle(this.style);
    this.id = id;
    this.balloon = new Config.vrPlanner.Balloon();
    this.point.setBalloon(this.balloon);
    this.visible = visible;
    this.title = title;
    this.fontFamily = fontFamily || "微软雅黑";
    this.fontSize = fontSize || 16;
    this.fontItalic = !!fontItalic;
    this.fontColor = fontColor || "#fff";
    this.icon = icon;
    this.height = height;
    this.iconVisible = iconVisible;
    this.titleVisible = titleVisible;
    this.line = new Config.vrPlanner.Feature.Line();
    this.lineVisible = lineVisible;
    this.altitudeMode = altitudeMode;
    this.contentId = contentId;
    this.subMenuId = subMenuId;
    this.className = className;
    this.showMessage = false;
    this.code = code;
    this.isCustom = isCustom;
    this.setLine();
    this.init();
    this.point.bindEvent("mouseEnter", () => this.style.setOpacity(0.8));
    this.point.bindEvent("mouseLeave", () => this.style.setOpacity(1));
  }

  set altitudeMode(mode) {
    this.point.setAltitudeMode(mode);
    this.line.setAltitudeMode(mode);
  }

  init() {
    this.setGeoLocation(this.geo);
    this.setLineVisible(this.titleVisible || this.iconVisible);
    this.setIcon({});
    this.balloon.setOffsetX(0);
    this.setVisible(this.visible == null ? true : this.visible);
  }

  /**
   * @param args (geo: GeoLocation, height: number) | (x: number, y: number, z?: number, height?: number)
   */
  setGeoLocation(...args) {
    let geo,
      height = this.height;
    if (typeof args[0] == "object" && "g" in args[0]) {
      geo = args[0];
      args.length == 2 && (height = args[1]);
    } else if (args.length >= 2) {
      let [x, y, z = this.geo.z()] = args;
      args.length == 4 && (height = args[3]);
      geo = new vrPlanner.GeoLocation(x, y, z);
    } else return;
    this.line.clearVertices();
    this.line.addVertex(geo);
    this.line.addVertex(geo.add(0, 0, height));
    this.point.setGeoLocation(geo.add(0, 0, height));
  }

  setHeight(height: number = this.height, z: number = this.geo.z()) {
    let g = this.point.getGeoLocation();
    g = new vrPlanner.GeoLocation(g.x(), g.y(), z + height);
    this.line.setVertex(1, g);
    this.point.setGeoLocation(g);
  }

  setAnimationHeight(bottom: number, height: number) {
    this.line.clearVertices();
    this.line.addVertex(this.geo.add(0, 0, bottom));
    this.line.addVertex(this.geo.add(0, 0, height));
    this.point.setGeoLocation(this.geo.add(0, 0, height));
  }

  setLineVisible(isVisible: boolean) {
    this.line.setVisible(isVisible);
  }

  static getById(id: number | string) {
    return this.marks.find(m => m.id == id);
  }

  setIcon({
    title = this.title,
    fontFamily = this.fontFamily,
    fontSize = this.fontSize,
    fontItalic = this.fontItalic,
    fontColor = this.fontColor,
    icon = this.icon,
    titleVisible = this.titleVisible,
    iconVisible = this.iconVisible,
    className = this.className,
    iconType = "1"
  }) {
    let html = `<div class="currentBalloon ${titleVisible ? className : ""}">`;
    if (titleVisible) {
      let className = "";
      if (Config.PLANID == 2289) {
        html = html.slice(0, -1) + ` style="height: auto">`;
        const matches = title.match(/^[\u4e00-\u9fa5]+/g);
        const cnWord = matches ? matches[0] : "";
        const enWord = title.slice(cnWord.length);
        title = `<div>${cnWord}</div>
              <hr/><div>${enWord}</div>`;
        className = "verticalTitle";
      }
      if (Config.PLANID == 2434 && this.isCustom) {
        html += `<div style="
        height:90px;
        padding:20px;
        display:flex;
        align-items: center;
        background:url(${labelBackground})no-repeat;
        background-size: 100% 100%;
        font-size:18px;
        text-shadow:none
        ">
        ${title}
        </div>`;
      } else if (Config.PLANID === 2442 && this.isLdShare) {
        const arr = title.split("-");//todo 莲都分享标签
        html += `<div class="ld-title">${arr[0]}：<span class="ld-title-count">${arr[1] ? arr[1] : ""}</span></div>`
      } else {
        html += `<div style="line-height: ${iconVisible ? "40px" : "initial"
          };color:${fontColor};font-size:${fontSize}px;font-family:${fontFamily};${fontItalic ? "transform:skewX(19deg);transform-origin:bottom" : ""
          }" class="${className}">${title}</div>`;
      }
    } else html += "<div></div>";
    if (iconVisible) {
      if (/.*\.svg$/.test(icon!)) {
        this.style.setUrl(require("../../assets/icon/transparent-10.png"));
        this.balloon.setOffsetY(15);
        html += `<img src=${Config.apiHost + icon} style="width: 75px;"/>`;
      } else {
        const base64Reg = /data:image\/.+\;base64\,.+/;
        const img = new Image();
        let num = icon.indexOf("/");
        img.src = base64Reg.test(icon)
          ? icon
          : num > 1
            ? process.env.publicPath + icon
            : Config.apiHost + icon;
        this.style.setUrl(img.src);
        img.onload = () => {
          if (Config.PLANID == 2289) {
            this.style.setHeight(img.height);
            this.style.setWidth(img.width);
          } else {
            this.style.setHeight(Math.min(img.height, 25));
            this.style.setWidth(
              (img.width / img.height) * Math.min(img.height, 25)
            );
          }
        };
        this.balloon.setOffsetY(10);
        if (Config.PLANID == 2289) {
          // this.balloon.setOffsetX(-20);
          this.balloon.setOffsetY(50);
        }
      }
    } else {
      this.style.setUrl(
        Config.apiHost + "/res/image/icon/sys/placemark_null.png"
      );

      if (Config.PLANID === 2434 && this.isCustom)
        this.balloon.setOffsetY(45)
      else
        this.balloon.setOffsetY(-18);
    }
    html += `</div>`;
    this.balloon.setMessage(html);
  }

  renderBalloon(args?: { click: boolean | Function }) {
    const { click = true } = args || {};
    const layer =
      maps.getLayerById("point-lineLayer") ||
      new vrPlanner.Layer.FeatureLayer("point-lineLayer");
    layer.setLodWindowSize(512);
    layer.setRenderTileTree(false);
    maps.addLayer(layer);
    layer.addFeature(this.line);
    if (click) {
      if (typeof click == "function")
        this.point.bindEvent("click", click.bind(this));
      else
        this.point.bindEvent("click", event => {
          if (event.isLeftClick()) {
            if (
              window["template"] == "putianEcology" ||
              Config.PLANID === 2300
            ) {
              DataService.getPlanDataTabs({ planDataId: this.id }).then(res => {
                this.setContents(res.data);
                if (res.data && res.data.length) {
                  const item = res.data.find(
                    item => item.type == "externalLink"
                  );
                  if (item && item.str) {
                    const url = /^https?\:\/\//.test(item.str)
                      ? item.str
                      : Config.apiHost + item.str;
                    const w = document.body.clientWidth;
                    const area = [w - 840 + "px", "fit-content"];
                    Config.layer.open({
                      type: 2,
                      title: this.title,
                      shadeClose: true,
                      shade: false,
                      maxmin: true, //开启最大化最小化按钮
                      skin: "layui-layer-share", //样式类名
                      area,
                      content: url,
                      success: (a, i) => {
                        const shareMarks = Mark.marks.filter(e => e.whethshare);
                        try {
                          const iframe = $(`[id^=layui-layer-iframe]`)[0];
                          const iframeWin = iframe.contentWindow;
                          const iframeDoc = iframe.contentDocument;
                          iframeWin.Mark = {
                            i: Mark.marks.findIndex(e => e.title == this.title),
                            data: shareMarks
                          };
                          const t = setInterval(() => {
                            let h = iframeDoc.body.scrollHeight;
                            h && clearInterval(t);
                          }, 100);
                        } catch (e) {
                          console.table(e);
                        }
                      }
                    });
                  } else this.showBalloonData();
                }
              });
            } else {
              if (this.showMessage) {
                this.showBalloonData();
              } else {
                if (Config.PLANID === 2442) {
                  this.showBalloonData()
                } else {
                  this.active();
                }

              }
            }
          }
        });
    }
  }

  /**
   * 点击balloon 显示标题或弹窗
   * @param showMsg {Boolean} 显示设置 showMessage
   */
  showBalloonData(showMsg?) {
    if (showMsg || this.showMessage) {
      const div = document.querySelector(`#markerBox${this.id}`);
      if (div) ReactDOM.unmountComponentAtNode(div);
      this.init();
    } else {
      let html = "";
      if (/.*\.svg$/.test(this.icon)) {
        html = `<div class="vrp-marker-box">
          <img src=${Config.apiHost + this.icon} style="width: 75px;"/>
          <div class=vrp-marker-msg id="markerBox${this.id
          }" style="left: 80px;bottom:25px;"></div>
        </div>`;
        this.balloon.setOffsetX(0);
        this.balloon.setOffsetY(-56);
      } else {
        const msgClass = Config.PLANID === 2442 ? "ld-marker-msg" : "vrp-marker-msg";
        html = `<div class="vrp-marker-box">
          <div class=${msgClass} id="markerBox${this.id}">
            </div>
          </div>`;
        this.balloon.setOffsetX(25);
        this.balloon.setOffsetY(-30);
      }
      this.balloon.setMessage(html);
      this.renderBalloonBox();
    }
    this.showMessage = showMsg == undefined ? !this.showMessage : !showMsg;
  }

  /**
   * 渲染弹窗组件 MarkerBoxModal
   */
  renderBalloonBox() {
    if (Config.PLANID === 2434) {
      const element = React.createElement(SyPopup, { data: this });
      render(element, `#markerBox${this.id}`);
    } else if (Config.PLANID === 2442) {
      console.log(this);
      const element = React.createElement(LdPopup, { data: this });
      render(element, `#markerBox${this.id}`);
    } else {
      const element = React.createElement(MarkerBoxModal, { data: this });
      render(element, `#markerBox${this.id}`);
    }
  }

  setLine() {
    const style = new Config.vrPlanner.Style.LineStyle();
    style.setWidth(1);
    style.setColor(new Config.vrPlanner.Color("ffffff"));
    style.setDepthTest(true);
    style.setAppearance(Config.vrPlanner.Style.LineStyle.APPEARANCE_FLAT_2D);
    style.setUnit(Config.vrPlanner.Style.LineStyle.UNIT_PIXELS);
    this.line.setStyle(style);
  }

  setContents(contents: any[]) {
    this.contents = [];
    if (contents.length) {
      this.contents = contents.map(item => new Content(item));
    }
  }

  removeContent(content: Content) {
    if (content.id) {
      for (let i = 0; i < this.contents.length; i++) {
        const ele = this.contents[i];
        if (ele.id === content.id) {
          this.contents.splice(i, 1);
          break;
        }
      }
    }
  }

  addContent(content: Content) {
    this.contents.push(content);
  }

  remove() {
    const layer = Config.maps.getLayerById("balloonLayer");
    const lineLayer = Config.maps.getLayerById("point-lineLayer");
    layer.removeFeature(this.point);
    lineLayer.removeFeature(this.line);
    Mark.remove(this);
  }

  static set(mark: Mark) {
    Mark.marks.unshift(mark);
    Mark.marks.sort(Tools.compare("id"));
    Mark.marks.reverse();
  }

  static remove(mark: Mark) {
    for (let i = 0; i < Mark.marks.length; i++) {
      const item = Mark.marks[i];
      if (item.id === mark.id) {
        Mark.marks.splice(i, 1);
        break;
      }
    }
  }

  focus(initial = false) {
    let side = 150,
      sideVec = new Config.vrPlanner.Math.Double3(0, -side, side);
    const geo = this.point.getGeoLocation();
    const cam = maps.getCamera();
    if (this.cameraPosition && this.cameraLook && !initial) {
      cam.flyTo(this.cameraPosition, this.cameraLook);
    } else {
      cam.flyTo(geo.add(sideVec), geo);
    }
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    this.point.setVisible(visible);
    this.line.setVisible(visible);
  }

  getVisible() {
    return this.point.isVisible();
  }

  async active(time?) {
    if (this.subMenuId) {
      ShareService.getSubMenu({ subId: this.subMenuId }, (f, r) => {
        f && r.data.length
          ? Play.play(r.data[0].feature)
          : message.error(r.message);
      });
    } else if (this.cameraPosition && this.cameraLook) {
      this.focus();
    }
    const results = await Promise.all([
      DataService.getPlanDataTabs({ planDataId: this.id }).then(r => r.data),
      this.contentId.length
        ? DataService.getContentTabs({ id: this.contentId.toString() }).then(
          r => r.data
        )
        : []
    ]);
    if (results) {
      this.setContents(results.reduce((r, c) => (r.push(...c), r), []));
      if (this.contents.length > 0) {
        this.showBalloonData();
      }
    }
  }
}

export class Balloon extends vrPlanner.Balloon {
  title: string;
  fontSize: number;
  fontColor: string;
  titleVisible: boolean;
  contentId: number[];
  contents: Content[] = [];
  // balloon: any;
  showMessage: boolean;

  constructor({
    id,
    title = "balloon",
    titleVisible = true,
    fontSize = 16,
    fontColor = "#fff",
    contentId = []
  }) {
    // this.balloon = new Config.vrPlanner.Balloon();
    super();
    this.id = id;
    this.title = title;
    this.titleVisible = titleVisible;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.showMessage = false;
    this.contentId = contentId;
    this.setTitle({ title });
  }

  init() {
    this.setTitle({ title: this.title });
    this.setOffsetX(0);
  }

  setTitle({
    title,
    titleVisible = this.titleVisible,
    fontColor = this.fontColor,
    fontSize = this.fontSize
  }) {
    let html = '<div class="currentBalloon">';
    if (titleVisible) {
      let className = "";
      html += `<div style="line-height:initial;color:${fontColor};font-size:${fontSize}px" class="${className}">${title}</div>`;
    } else html += "<div></div>";
    html += `</div>`;
    this.setMessage(html);
  }

  /**
   * @param showMsg {Boolean} 显示设置 showMessage
   */
  showBalloonData(showMsg?) {
    if (showMsg || this.showMessage) {
      const div = document.querySelector(`#markerBox${this.id}`);
      if (div) ReactDOM.unmountComponentAtNode(div);
      this.init();
    } else {
      let html = `<div class="vrp-marker-box">
          <div class="vrp-marker-msg" id="markerBox${this.id}">
            </div>
          </div>`;
      this.setOffsetX(25);
      this.setMessage(html);
      this.renderBalloonBox();
    }
    this.showMessage = showMsg == undefined ? !this.showMessage : !showMsg;
  }

  /**
   * 渲染弹窗组件 MarkerBoxModal
   */
  renderBalloonBox() {
    const element = React.createElement(MarkerBoxModal, { data: this });
    const interval = setInterval(() => {
      const div = document.getElementById(`markerBox${this.id}`);
      if (div) {
        ReactDOM.render(element, div);
        clearInterval(interval);
      }
    });
  }

  setContents(contents: any[]) {
    this.contents = [];
    if (contents.length) {
      this.contents = contents.map(item => new Content(item));
    }
  }

  active(time?) {
    if (this.contentId.length) {
      DataService.getContentTabs({ id: this.contentId.toString() }).then(r => {
        this.setContents(r.data);
        if (r.data.length > 0) {
          this.showBalloonData();
        }
      });
    }
  }
}

export class Content {
  id: number;
  icon: string;
  items: any;
  name: string;
  planDataId: number;
  type: string;
  str: string;
  isEdit: boolean;
  isNew: boolean;

  constructor({
    id = 0,
    icon = "",
    items = null,
    name = "未命名",
    planDataId = 0,
    type = "",
    str = "",
    isEdit = false,
    isNew = false
  }) {
    this.id = id;
    this.icon = icon;
    this.items = items;
    this.name = name;
    this.planDataId = planDataId;
    this.type = type;
    this.str = str;
    this.isEdit = isEdit;
    this.isNew = isNew;
  }
}
