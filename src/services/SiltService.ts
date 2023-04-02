import BaseService from "./BaseService";

export default class SiltService extends BaseService {
  /**
   * 获取冲淤数据源选取列表
   * @param data { planId }
   * @param callback
   */
  static getListByPlanId (data, callback: (bool, res) => void) {
    const req = super.request("/Silt/getListByPlanId");
    req.get();
    req.params(data);
    req.execute(callback);
  }

}
