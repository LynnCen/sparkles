import BaseService from "./BaseService";

interface GetData {
  id: number;
  dataType?: string;
  dataIdList?: string;
}

interface AddDelModel {
  planId: number;
  terrainId: number | string;
}

export default class PlanService extends BaseService {
  static getData(data: GetData, callback: (bool, res) => void) {
    const request = super.request("/Data/getPlanData");
    request.get();
    request.params(data);
    request.execute(callback);
  }

  static getPlan(data: GetData, callback: (bool, res) => void) {
    const request = super.request("/Data/getPlanInfo");
    request.get();
    request.params(data);
    request.execute(callback);
  }

  static addTerrain(data: AddDelModel, callback: (bool, res) => void) {
    const request = super.request("/Data/addTerrainById");
    request.params(data);
    request.execute(callback);
  }

  static delTerrain(data: AddDelModel, callback: (bool, res) => void) {
    const request = super.request("/Data/delTerrainById");
    request.params(data);
    request.execute(callback);
  }

  static initCamera(data, callback: (bool, res) => void) {
    const request = super.request("/Data/setInitLook");
    request.params(data);
    request.execute(callback);
  }

  static modDataLimit(data, callback: (bool, res) => void) {
    const request = super.request("/Plan/modDataLimit");
    request.params(data);
    request.execute(callback);
  }

  static SortMenu(data) {
    const request = super.request("/Plan/SortMenu");
    request.params(data);
    return request.exec();
  }

  static getMonitor(
    data: { minlo: number; maxlo: number; minla: number; maxla: number },
    callback: (bool, res) => void
  ) {
    const request = super.request("/Data/getMonitor");
    request.params(data);
    request.execute(callback);
  }
  static getShare(data, callback: (bool, res) => void) {
    const request = super.request("/Open/getSharePlan");
    request.params(data);
    request.execute(callback);
  }
  static checkSharePwd(data, callback: (bool, res) => void) {
    const request = super.request("/Open/getSharePlanByPwd");
    request.params(data);
    request.execute(callback);
  }
  /**
   * @param data { id, picture }
   */
  static updatePlan(data, callback: (bool, res) => void) {
    const request = super.request("/Plan/updatePlan");
    request.params(data);
    request.execute(callback);
  }
}
