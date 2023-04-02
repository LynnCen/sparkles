import BaseService from "./BaseService";

export default class SimpleLayerService extends BaseService {

  /**
   * @param data : { page: number, size: number }
   * @param callback
   */
  // static getList(data, callback: (bool, res) => void) {
  //   const req = super.request("/layer/listByPlanId");
  //   req.get();
  //   req.params(data);
  //   req.execute(callback);
  // }

  static getListAll(data, callback: (bool, res) => void) {
    const req = super.request("/layer/listByPlanId");
    req.get();
    req.params(data);
    req.execute(callback);
  }
  /**
   * @param data ：layerAddModel
   * @param callback
   */
  static add(data, callback: (bool, res) => void) {
    const req = super.request("/layer/add");
    req.execute(data,callback);
  }

  /**
   * @param data layerUpdateModel
   * @param callback
   */
  static update(data, callback: (bool, res) => void) {
    const req = super.request("/layer/update");
    req.put();
    req.execute(data,callback);
  }
  /**
   * @param data  layerId
   * @param callback
   */
  static del(data, callback: (bool, res) => void) {
    const req = super.request("/layer/delete");
    req.params(data);
    req.del();
    req.execute(callback);
  }
}
