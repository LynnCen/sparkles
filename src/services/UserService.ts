import BaseService from "./BaseService";
import { message } from "antd";
import Config from "../config/Config";

export default class UserService extends BaseService {
  public static IsUserNameExists(data: { username: string }, callback: (bool, res) => void) {
    const request = super.request("/User/IsUserNameExists");
    request.params(data);
    request.get();
    request.execute(callback);
  }

  public static getPlanUserInfo(data: { id: number }, callback: (bool, res) => void) {
    const request = super.request("/Data/getPlanUserInfo");
    request.params(data);
    request.get();
    request.execute(callback);
  }

  public static getMyTerrain(
    data: { page: number; size: number; key?: string },
    callback: (bool, res) => void
  ) {
    const request = super.request("/Data/getMyTerrain");
    request.params(data);
    request.get();
    request.execute(callback);
  }

  /**
   * @description 获取站点配置
   */
  public static getSiteConfig() {
    return fetch(`${Config.apiHost}/SiteManager/LoadConfig`, {
      credentials: "include"
    })
      .then(r => r.json())
      .catch(message.error);
  }
  /**
   * @description 定时更新用户状态
   * @param callback
   */
  public static keepLive(callback: (bool, res) => void) {
    const request = super.request("/Open/keepLive");
    request.get();
    request.execute(callback);
  }
  /**
   * @description 检查用户是否登录
   * @param callback
   */
  public static checkLogin(callback: (bool, res) => void) {
    const request = super.request("/User/checkLogin");
    request.execute(callback);
  }

  public static getPeoples(data, url, callback: (bool, res) => void) {
    const request = super.completeUrl(url);
    request.get();
    request.params(data);
    request.execute(data, callback);
  }
}
