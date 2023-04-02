import BaseService from "./BaseService";

export default class LayerService extends BaseService {
  /**
   * @param data : { page: number, size: number }
   * @param callback
   */
  static getList(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/getList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  static getListAll(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/getListAll");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  /**
   * @param data { whethshare, type, dataId, opacity, planId, icon, legends }
   * @param callback
   */
  static add(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/add");
    req.params(data);
    req.execute(callback);
  }

  /**
   * @param data { id, whethshare, type, dataId, opacity, planId, icon, legends }
   * @param callback
   */
  static update(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/update");
    req.params(data);
    req.execute(callback);
  }
  /**
   * @param data { id }
   * @param callback
   */
  static del(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/del");
    req.params(data);
    req.execute(callback);
  }
  /**
   * @param data { id }
   * @param callback
   */
  static delLegend(data, callback: (bool, res) => void) {
    const req = super.request("/Layer/delLegend");
    req.params(data);
    req.execute(callback);
  }

  static getSelectionList(data, callback: (bool, res) => void) {
    const req = super.request("/Signlegend/getSelectionList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
}
