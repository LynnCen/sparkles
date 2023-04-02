import BaseService from "./BaseService";

export default class LegendService extends BaseService {
  /**
   * @param data : { page: number, size: number }
   * @param callback
   */
  static getList(data, callback: (bool, res) => void) {
    const req = super.request("/Signlegend/getList");
    req.get();
    req.params(data);
    req.execute(callback);
  }
}
