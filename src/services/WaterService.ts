import BaseService from "./BaseService";

export default class WaterService extends BaseService {
  // static getWaterList1(data, callback: (bool, res) => void) {
  //   const req = super.request("/Water/getList1");
  //   req.get();
  //   req.params(data);
  //   req.execute(callback);
  // }
  /**
   * @param data : { monitor: string, addr: string, type: string}
   * @param callback
   */
  static getValueByAddrAndTableName(data, callback: (bool, res) => void) {
    const req = super.request("/Water/getValueByAddrAndTableName");
    req.get();
    req.params(data);
    req.execute(callback);
  }
}
