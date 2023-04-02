import BaseService from "./BaseService";
import Config from "../config/Config";

export default class CADService extends BaseService {
  public static getJSON(url, callback: (bool, res) => void) {
    const request = super.request(url);
    request.get();
    request.execute(callback);
  }
  /**
   * @param data : { page: number, size: number, key?: string, major?: string}
   * @param callback
   */
  static getList(data, callback: (bool, res) => void) {
    const req = super.request("/CAD/getList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  /**
   * CAD面板数据
   * @param data { planId, key? }
   * @param callback
   */
  static getFormatListForShare(data, callback: (bool, res) => void) {
    const req = super.request("/CAD/getFormatListForShare");
    req.get();
    req.params(data);
    req.execute(callback);
  }

  /**
   * CAD面板数据
   * @param data { planId, key? }
   * @param callback
   */
  static getFormatList(data, callback: (bool, res) => void) {
    const req = super.request("/CAD/getFormatList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  /**
   * 获取CAD数据源选取列表
   * @param data { planId, cadId? }
   * @param callback
   */
  static getSelectionList(data, callback: (bool, res) => void) {
    const req = super.request("/CAD/getSelectionList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  /**
   * 保存CAD面板数据
   * @param data { planId, cads, cadFiles, ...form }
   * @param callback
   */
  static addFormat(
    { planId, cads, cadFiles, ...form },
    callback: (bool, res) => void
  ) {
    const req = super.request(
      `/CAD/addFormat?planId=${planId}&cads=${cads}&cadFiles=${cadFiles}`
    );
    req.params(form);
    req.execute(callback);
  }
  /**
   * 修改CAD面板数据
   * @param data { id, cads, cadFiles, ...form }
   * @param callback
   */
  static updateFormat(
    { id, cads, cadFiles, ...form },
    callback: (bool, res) => void
  ) {
    const req = super.request(
      `/CAD/updateFormat?id=${id}&cads=${cads}&cadFiles=${cadFiles}`
    );
    req.put();
    req.params(form);
    req.execute(callback);
  }
  /**
   * 删除CAD面板数据
   * @param id
   * @param callback
   */
  static deleteFormat(id, callback: (bool, res) => void) {
    fetch(Config.getAPI(`/CAD/deleteFormat?id=${id}`), {
      method: "DELETE",
      credentials: "include"
    })
      .then(r => r.json())
      .then(r =>
        r.code == 200 ? callback(true, r) : callback(false, r.message)
      )
      .catch(e => callback(false, e));
  }
}
