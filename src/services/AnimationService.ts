import BaseService from "./BaseService";


export default class AnimationService extends BaseService {
  static addALine(data, callback: (bool, res) => void) {
    const request = super.request("/Animationline/add");

    request.params(data);
    request.execute(callback);
  }


  static modALine(data, callback: (bool, res) => void) {
    const request = super.request("/Animationline/update");
    request.params(data);
    request.execute(callback);
  }
  static getData(data, callback: (bool, res) => void) {
    const request = super.request('/Animationline/getList1');
    request.get();
    request.params(data);
    request.execute(callback)
  }
  static delData(data, callback: (bool, res) => void) {
    const request = super.request('/Animationline/del');
    request.params(data);
    request.execute(callback)
  }
  static addGPSLine(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/addLine");

    request.params(data);
    request.execute(callback);
  }

  static getGPSLine(data, callback: (bool, res) => void) {
    const request = super.request('/Gps/getList1');
    request.get();
    request.params(data);
    request.execute(callback)
  }
  static modGPSLine(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/updateLine");
    request.params(data);
    request.execute(callback);
  }
  static delGPSLine(data, callback: (bool, res) => void) {
    const request = super.request('/Gps/del');
    request.params(data);
    request.execute(callback)
  }
  static addGPSModel(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/addModel");
    request.params(data);
    request.execute(callback);
  }
  static delGPSModel(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/delModel");
    request.params(data);
    request.execute(callback);
  }
  static modGPSModel(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/updateModel");
    request.params(data);
    request.execute(callback);
  }
  static addAModel(data, callback: (bool, res) => void) {
    const request = super.request("/Animatemodel/add");
    request.params(data);
    request.execute(callback);
  }
  static modAModel(data, callback: (bool, res) => void) {
    const request = super.request("/Animatemodel/update");
    request.params(data);
    request.execute(callback);
  }
  static getAModel(data, callback: (bool, res) => void) {
    const request = super.request("/Animatemodel/getList1");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  static delAModel(data, callback: (bool, res) => void) {
    const request = super.request("/Animatemodel/del");
    request.params(data);
    request.execute(callback);
  }
  static getShipList(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/getShipList");
    request.get();
    request.params(data);
    request.execute(callback);
  }
  static getShipPoiListdef(data, callback: (bool, res) => void) {
    const request = super.request("/Gps/ShipPoiListdef");
    request.get();
    request.params(data);
    request.execute(callback);
  }
}