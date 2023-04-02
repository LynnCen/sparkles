import BaseService from "./BaseService";
import Config from "../config/Config";
import { message } from "antd";

export default class TerrainService extends BaseService {
  static getData(url, callback: (bool, res) => void) {
    const XMLHttp = new XMLHttpRequest();
    XMLHttp.open("GET", url, true);
    XMLHttp.setRequestHeader("Content-Type", "application/json");
    XMLHttp.setRequestHeader("Accept", "application/json");
    XMLHttp.setRequestHeader("Accept-Language", "zh-cn,zh;q=0.5");
    XMLHttp.send();
    XMLHttp.onreadystatechange = () => {
      if (XMLHttp.readyState === 4) {
        if (XMLHttp.status === 200) {
          const result = JSON.parse(XMLHttp.responseText);
          callback(true, result);
        } else {
          callback(false, "Request was failure: " + XMLHttp.status);
        }
      }
    };
  }

  static getTerrain(data: { id: number | string }) {
    return fetch(`${Config.apiHost}/Data/getTerrainById?id=${data.id}`, {
      credentials: "include"
    })
      .then(r => r.json())
      .catch(message.error);
  }

  static getTerrainAltitude(data, callback: (bool, res) => void) {
    const request = super.request("/Data/getAltitude");
    request.get();
    request.params(data);
    request.execute(callback);
  }

  static setTerrainAltitude(data, callback: (bool, res) => void) {
    const request = super.request("/Data/setPlanTerrain");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  static setTerrainOpacity(data, callback: (bool, res) => void) {
    const request = super.request("/Data/setTerrainOpacity");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  /**
   * @param data { id, thumbnail }
   */
  static UpdateTerrain(data, callback: (bool, res) => void) {
    const request = super.request("/Terrain/UpdateTerrain");
    request.params(data);
    request.execute(callback);
  }
}
