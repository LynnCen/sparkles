import { message } from "antd";
import BaseService from "./BaseService";

export default class ShareService extends BaseService {
  private static Controller = "/Share/";
  /**
   * @description 保存、编辑分享菜单
   * @param data {jsonString} json数据字符串
   * @param callback
   */
  static saveMenu(data) {
    const request = super.request(this.Controller + "saveMenu");
    request.params(data);
    return request
      .exec()
      .then(r => (message.success(r.message), r))
      .catch(r => message.error(r.message));
  }
  /**
   * @description 根据url获取分享数据
   * @param callback
   */
  static getInfo(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "getInfo");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 根据方案Id获取当前方案的分享数据
   * @param data {planId} 方案Id
   * @param callback
   */
  static get(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "get");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 根据planId+key或subId获取分享二级菜单
   * @param data {planId? key? subId?}
   * @param callback
   */
  static getSubMenu(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "getSubMenu");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 根据方案Id创建分享
   * @param data {planId}
   * @param callback
   */
  static create(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "create");
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 删除分享的数据
   * @param data {id} 动画Id
   * @param callback
   */
  // static delete(data, callback: (bool, res) => void) {
  //   const request = super.request(this.Controller + "delete");
  //   request.params(data);
  //   request.execute(callback);
  // }
  /**
   * @description 保存分享数据
   * @param data {animationId,eleList}
   * @param callback
   */
  static saveAllMenu(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "saveAllMenu");
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 保存行业模板
   * @param data {animationId,template}
   * @param callback
   */
  static saveTemp(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "saveTemp");
    request.params(data);
    request.execute(callback);
  }
  /**
   * @description 删除一级菜单
   * @param data {id}
   * @param callback
   */

  static delMenu(data) {
    const request = super.request(this.Controller + "delMenu");
    request.params(data);
    return request
      .exec()
      .then(r => (message.success(r.message), r))
      .catch(r => message.error(r.message));
  }

  /**
   * @description 分享关闭/开启s
   * @param data {animationId,isOpen:boolean}
   * @param callback
   */
  static setOpen(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "setOpen");
    request.params(data);
    request.execute(callback);
  }

  // static saveCompared(data, callback: (bool, res) => void) {
  //   const request = super.request(this.Controller + "saveChangeMenu");
  //   request.params(data);
  //   request.execute(callback);
  // }

  static setTerrains(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "setTerrains");
    request.params(data);
    request.execute(callback);
  }
  static setEndTime(data, callback: (bool, res) => void) {
    const request = super.request(this.Controller + "setEndTime");
    request.params(data);
    request.execute(callback);
  }
}
