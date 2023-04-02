import BaseService from './BaseService';
import Config from "../config/Config";

export default class ModelService extends BaseService {
  public static getModel(data: { planId: number, modelType: string,}, callback: (bool, res) => void) {
    const request = super.request('/Data/getModelLib');
    request.params(data);
    request.get();
    request.execute(callback)
  }

  /**
   * @description 是否为最后一个
   */
  public static isLast(data: { id }, callback: (bool, res) => void) {
    const request = super.request('/Model/IsLast');
    request.params(data);
    request.execute(callback)
  }

  /**
   * @description 上传模型回调
   */
  public static callBack(data: { id, type }, callback: (bool, res) => void) {
    const request = super.request('/Model/CallBack');
    request.params(data);
    request.execute(callback)
  }

  /**
   * @description 删除模型
   */
  public static del(data:  { id:string}, callback: (bool, res) => void) {
    const request = super.request('/Model/DelModel');
    request.params(data);
    request.get();
    request.execute(callback)
  }
  /**
   * @description 获取模型类别
   */
  public static getLevelList( callback: (bool, res) => void) {
    const request = super.request('/Model/getLevelList');
    request.get();
    request.execute(callback)
  }
}
