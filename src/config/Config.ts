import { message, notification } from "antd";
import StrConfig from "./StrConfig";
import UserService from "../services/UserService";
import { debounce } from "../utils/common";

export default class Config {
  // static BaseName;
  static _apiHost = "";
  static get apiHost() {
    return this._apiHost;
  }

  static set apiHost(value) {
    this._apiHost = value;
  }

  static _vrPlanner = null;
  static get vrPlanner(): any {
    return this._vrPlanner;
  }

  static set vrPlanner(value: any) {
    this._vrPlanner = value;
  }

  static _maps = null;
  static get maps(): any {
    return this._maps;
  }

  static set maps(value: any) {
    this._maps = value;
  }

  static _layer = null;
  static get layer(): any {
    return this._layer;
  }

  static set layer(value: any) {
    this._layer = value;
  }

  static _MODALBOX = null;
  static get MODALBOX(): any {
    return this._MODALBOX;
  }

  static set MODALBOX(value: any) {
    this._MODALBOX = value;
  }

  static _USERNAME = "";
  static get USERNAME() {
    return this._USERNAME;
  }

  static set USERNAME(value) {
    this._USERNAME = value;
  }

  static _loggedIn = false;
  static get loggedIn() {
    return this._loggedIn;
  }

  static set loggedIn(value: boolean) {
    this._loggedIn = value;
  }

  static _PLANID = 0;
  static get PLANID() {
    return this._PLANID;
  }

  static set PLANID(value) {
    this._PLANID = value;
  }

  static _level = 0;
  static get level() {
    return this._level;
  }

  static set level(value) {
    this._level = value;
  }

  static _regeoHost = "";
  static get regeoHost() {
    return this._regeoHost;
  }

  static set regeoHost(value) {
    this._regeoHost = value;
  }

  static _textHost = "";
  static get textHost() {
    return this._textHost;
  }

  static set textHost(value) {
    this._textHost = value;
  }

  static _aroundHost = "";
  static get aroundHost() {
    return this._aroundHost;
  }

  static set aroundHost(value) {
    this._aroundHost = value;
  }

  static _ActionTipsCount = 0;
  static get ActionTipsCount() {
    return this._ActionTipsCount;
  }

  static set ActionTipsCount(value: number) {
    localStorage.setItem("actionTipsCount", value.toString());
    this._ActionTipsCount = value;
  }

  static isTest: boolean;

  private static _ScenesSetData = "";
  static get ScenesSetData(): string {
    return this._ScenesSetData;
  }

  static set ScenesSetData(value: string) {
    localStorage.setItem("ScenesSetData", value);
    this._ScenesSetData = value;
  }

  private static _CameraSetData = "";
  static get CameraSetData(): string {
    return this._CameraSetData;
  }

  static set CameraSetData(value: string) {
    localStorage.setItem("CameraSetData", value);
    this._CameraSetData = value;
  }

  private static _CameraPosition = "";
  static get CameraPosition(): string {
    return this._CameraPosition;
  }

  static set CameraPosition(value: string) {
    localStorage.setItem("CameraPosition", value);
    this._CameraPosition = value;
  }

  static isMap = false;

  private static _setConfig = "";
  static get setConfig() {
    return this._setConfig;
  }

  static set setConfig(value) {
    localStorage.setItem("setConfig", value);
    this._setConfig = value;
  }
  private static _keyboard: boolean;
  static get keyboard() {
    return this._keyboard;
  }
  static set keyboard(f: boolean) {
    this._keyboard = f;
    Object.keys(this.keyPair).forEach(k => (this.keyPair[k] = 0));
    self["maps"].getInput().setKeyboard(f ? keyboard : {});
  }

  static init() {
    const root = document.getElementById("root")!!;
    this.apiHost = process.env.apiHost!!; //root.getAttribute("data-api-host")!!;
    this.regeoHost = root.getAttribute("data-regeo-host")!!;
    this.textHost = root.getAttribute("data-text-host")!!;
    this.aroundHost = root.getAttribute("data-around-host")!!;
    this.isTest = process.env.NODE_ENV === "development"; // this.isTest = JSON.parse(root.getAttribute("data-isTest")!!);
    // this.BaseName = this.isTest ? "#" : "editor/#";
    this.MODALBOX = document.getElementById("modal-container")!!;
    const aCount = localStorage.getItem("actionTipsCount");
    this._ActionTipsCount = aCount !== null ? parseInt(aCount, 10) : 0;
    this.vrPlanner = self["vrplanner"];
    this.maps = self["maps"];
    this.layer = self["layer"];

    if (!this.loggedIn) {
      UserService.checkLogin((flag, res) => {
        this.loggedIn = res.data;
        !res.data &&
          /#\/(edit|shareppt)/.test(location.hash) &&
          (message.error(res.message), Config.goLogin());
      });
    }

    if (this.isTest) {
      this.USERNAME = "admin";
      this.PLANID = 2434;
    } else {
      const user = localStorage.getItem("editUser");
      if (user != null) {
        this.USERNAME = user;
      }
      const planId = localStorage.getItem("planId");
      if (planId != null) {
        this.PLANID = parseInt(planId, 10);
      }
    }

    const level = localStorage.getItem("leave");
    if (level && level.length > 0) {
      this._level = Number(level);
    }

    const scenes = localStorage.getItem("ScenesSetData");
    if (scenes && scenes.length > 0) {
      this._ScenesSetData = scenes;
    } else {
      const init = {
        minLevel: 6,
        maxLevel: 22,
        windowSize: 1,
        sharpness: 1
      };
      this._ScenesSetData = JSON.stringify(init);
      Config.keyboard = true;
      document.body.addEventListener(
        "click",
        debounce(e => {
          if (e.target.id != "map_container-canvas" && Config.keyboard) {
            Config.keyboard = false;
          } else if (e.target.id == "map_container-canvas" && !Config.keyboard) {
            Config.keyboard = true;
          }
        }, 950)
      );
    }
    const camera = localStorage.getItem("CameraSetData");
    if (camera && camera.length > 0) {
      this._CameraSetData = camera;
    } else {
      const init = {
        minZoom: 25,
        maxZoom: StrConfig.defaultMaxZoom,
        near: 0,
        far: 0
      };
      this._CameraSetData = JSON.stringify(init);
    }

    const pos = localStorage.getItem("CameraPosition");
    if (pos && pos.length > 0) {
      this._CameraPosition = pos;
    }

    message.config({
      top: 100,
      duration: 2,
      maxCount: 3
    });

    notification.config({
      top: 80
    });
    UserService.getSiteConfig().then(res => {
      (document.getElementById("sys_page_icon") as HTMLLinkElement).href =
        this.apiHost + res.data["pageIcon"];
      this.setConfig = JSON.stringify(res.data);
      window["NProgress"].set(0.4);
    });
  }

  /**
   * @description 生成请求的url地址
   @return url(不包括具体参数)
   * @param api
   */
  static getAPI(api: string): string {
    return Config.apiHost + api;
  }

  /**
   @description 测试是否支持WebGL
   @returns {boolean}
   **/
  static isSupportWebGL() {
    const canvasDom = document.createElement("canvas");
    if (canvasDom.getContext) {
      const WebGL = canvasDom.getContext("experimental-webgl");
      return !!WebGL;
    } else {
      return false;
    }
  }

  /**
   * @description 清除相机位置参数
   */
  static removeCameraPosition() {
    localStorage.removeItem("CameraPosition");
    this._CameraPosition = "";
  }

  static goLogin() {
    process.env.NODE_ENV == "production" &&
      setTimeout(
        () => {
          window.location.href = "/";
        },
        process.env.STAGE ? 8000 : 300
      );
  }

  static isManager() {
    return this.level === 2;
  }

  static moveSpeed = 0.2;
  static pitchSpeed = 28;
  static yawSpeed = 28;
  static keyPair = {
    rise: 0,
    set Q(f) {
      this.rise = f;
    },
    descend: 0,
    set E(f) {
      this.descend = f;
    },
    moveSpeedUp: 0, //+
    set k(f) {
      this.moveSpeedUp = f;
    },
    moveSpeedDown: 0, //-
    set m(f) {
      this.moveSpeedDown = f;
    },
    moveForward: 0,
    set W(f) {
      this.moveForward = f;
    },
    moveBackward: 0,
    set S(f) {
      this.moveBackward = f;
    },
    moveLeft: 0,
    set A(f) {
      this.moveLeft = f;
    },
    moveRight: 0,
    set D(f) {
      this.moveRight = f;
    },
    pitchUp: 0,
    set "&"(f) {
      this.pitchUp = f;
    },
    pitchDown: 0,
    set "("(f) {
      this.pitchDown = f;
    },
    yawLeft: 0,
    set "%"(f) {
      this.yawLeft = f;
    },
    yawRight: 0,
    set "'"(f) {
      this.yawRight = f;
    }
  };
}

export const keyboard = {
  keydown: e => {
    const keyChar = String.fromCharCode(e.getKeyCode());
    Config.keyPair[keyChar] = 1;
  },
  keyup: e => {
    const keyChar = String.fromCharCode(e.getKeyCode());
    Config.keyPair[keyChar] = 0;
  },
  update: e => {
    const AUTO_PITCH_HEIGHT = 30;
    const AUTO_PITCH_SPEED = 50;
    const moveSpeed = Config.moveSpeed;
    const pitchSpeed = Config.pitchSpeed;
    const deltaTime = e.getDeltaTime();
    const cam = self["maps"].getCamera();
    const currCamPos = cam.getPosition();
    const currAltitude = currCamPos.getAltitude();
    const geo = cam.getGeoLocation();
    let doPitch = false;
    if (currAltitude < AUTO_PITCH_HEIGHT) {
      doPitch = true;
    }
    if (Config.keyPair["rise"]) {
      cam.setPosition(geo.add(0, 0, pitchSpeed * deltaTime * 2));
    } else if (Config.keyPair["descend"]) {
      cam.setPosition(geo.add(0, 0, -pitchSpeed * deltaTime * 2));
    }
    if (Config.keyPair["moveSpeedUp"]) {
      Config.moveSpeed += 0.01;
    } else if (Config.keyPair["moveSpeedDown"]) {
      Config.moveSpeed -= 0.01;
    }
    if (Config.keyPair["moveForward"]) {
      if (doPitch && cam.getPitch() < 0) {
        cam.pitch(AUTO_PITCH_SPEED * deltaTime);
      } else {
        cam.moveForward(moveSpeed, deltaTime);
      }
    } else if (Config.keyPair["moveBackward"]) {
      cam.moveBackward(moveSpeed, deltaTime);
    }
    if (Config.keyPair["moveLeft"]) {
      cam.moveLeft(moveSpeed, deltaTime);
    } else if (Config.keyPair["moveRight"]) {
      cam.moveRight(moveSpeed, deltaTime);
    }
    if (Config.keyPair["pitchUp"]) {
      cam.pitch(+Config.pitchSpeed * deltaTime);
    } else if (Config.keyPair["pitchDown"]) {
      cam.pitch(-Config.pitchSpeed * deltaTime);
    }
    if (Config.keyPair["yawLeft"]) {
      cam.yaw(+Config.yawSpeed * deltaTime);
    } else if (Config.keyPair["yawRight"]) {
      cam.yaw(-Config.yawSpeed * deltaTime);
    }
  }
};
