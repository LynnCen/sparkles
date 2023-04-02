import BaseService from "./BaseService";
import Config from "../config/Config";
import { message } from "antd";

interface GetIconData {
  type: any;
  page: number;
  size: number;
  classId?: number;
  key?: string;
}

export default class DataService extends BaseService {
  static addData(data, callback: (bool, res) => void) {
    const request = super.request("/Data/addPlanData");
    request.params(data);
    request.execute(callback);
  }

  static modData(data, callback: (bool, res) => void) {
    const request = super.request("/Data/modPlanData");
    request.params(data);
    request.execute(callback);
  }

  static delData(data, callback: (bool, res) => void) {
    const request = super.request("/Data/delPlanData");
    request.params(data);
    request.execute(callback);
  }

  static getPlanDataById(data, callback: (bool, res) => void) {
    const request = super.request("/Data/getPlanDataById");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  static delAllPlanData(data, callback: (bool, res) => void) {
    const request = super.request("/Data/delAllPlanData");
    request.params(data);
    request.execute(callback);
  } static getPlanDataTabs(data) {
    return fetch(
      `${Config.apiHost}/Data/getPlanDataTabs?planDataId=${data.planDataId}`,
      {
        credentials: "include"
      }
    )
      .then(r => r.json())
      .catch(message.error);
  }

  static savePlanDataTab(data, callback: (bool, res) => void) {
    const request = super.request("/Data/savePlanDataTab");
    request.params(data);
    request.execute(callback);
  }

  static delPlanDataTab(data, callback: (bool, res) => void) {
    const request = super.request("/Data/delPlanDataTab");
    request.params(data);
    request.execute(callback);
  }

  //信息栏
  /**
   * @param data { planId, page?, size?, key? }
   */
  static getContents(data, callback: (bool, res) => void) {
    const request = super.request("/Data/getContents");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @param data { id: number[] }
   */
  static getContentsById(data, callback: (bool, res) => void) {
    const request = super.request("/Data/getContentsById");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @param data { id: number|number[].toString() }
   */
  static getContentTabs(data) {
    return fetch(`${Config.apiHost}/Data/getContentTabs?id=${data.id}`, {
      credentials: "include"
    })
      .then(r => r.json())
      .catch(message.error);
  }
  static saveContent(data, callback: (bool, res) => void) {
    const request = super.request("/Data/saveContent");
    request.params(data);
    request.execute(callback);
  }
  static saveContentTab(data, callback: (bool, res) => void) {
    const request = super.request("/Data/saveContentTab");
    request.params(data);
    request.execute(callback);
  }
  /**
   * @param data { ids, tabId?, subId? }
   */
  static delContent(data, callback: (bool, res) => void) {
    const request = super.request("/Data/delContent");
    request.params(data);
    request.execute(callback);
  }

  static findIcon(data: GetIconData, callback: (bool, res) => void) {
    const request = super.request("/Data/findIcon");
    request.get();
    request.params(data);
    request.execute(callback);
  }

  public static getAllClass(
    data: { type: any },
    callback: (bool, res) => void
  ) {
    const request = super.request("/Data/getIconClassByEdit");
    request.get();
    request.params(data);
    request.execute(callback);
  }

  /**
   * @description 上传接口 /Model/UploadModel、图片/Model/UploadImg
   */
  public static upload(data, url, callback: (bool, res) => void) {
    const XMLHttp = new XMLHttpRequest();
    XMLHttp.open("POST", Config.getAPI(url), true);
    XMLHttp.withCredentials = true;
    XMLHttp.onreadystatechange = () => {
      if (XMLHttp.readyState === 4) {
        if (XMLHttp.status === 200) {
          const result = JSON.parse(XMLHttp.responseText);
          if (result.code === 200) {
            callback(true, result);
          } else {
            callback(false, result);
          }
        } else {
          callback(false, "Request was failure: " + XMLHttp.status);
        }
      }
    };
    XMLHttp.send(data);
  }

  /**
   * @description 获取图片、视频列表
   */
  static getList(url, data, callback) {
    const request = super.request(url);
    request.get();
    request.params(data);
    request.execute(callback);
  }
}
