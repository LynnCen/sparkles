import BaseService from "./BaseService";

export default class SurveryService extends BaseService {
  static getListByPlanId(
    data: { page: number; size: number; planId: number },
    callback: (bool, res) => void
  ) {
    const req = super.request("/Survey/getListByPlanId");
    req.get();
    req.params(data);
    req.execute(callback);
  }
}
