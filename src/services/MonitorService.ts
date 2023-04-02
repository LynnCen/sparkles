import BaseService from "./BaseService";
import {IGetList} from "../models/BaseModel";
import StrConfig from "../config/StrConfig";

// const videoHost = 'http://33.255.240.123:8314';
export default class MonitorService extends BaseService {

  /**
   * @description 监控列表
   */
  public static list(data: IGetList, callback: (bool, res) => void) {
    const request = super.request('/Open/findAllMonitor');
    request.params(data);
    request.execute(callback)
  }

  /**
   * @description 删除监控
   */
  public static del(data: { id: number }, callback: (bool, res) => void) {
    const request = super.request('/Open/delMonitor');
    request.params(data);
    request.execute(callback)
  }

  /**
   * @description 获取组织监控列表
   */
  public static getDataList(data: { orgId?: string, page?: number, size?: number, devId?: string }, isChannel: boolean, callback: (bool, res) => void) {
    const request = super.request(isChannel ? StrConfig.getChannelListApi : StrConfig.getOrgListAPi);
    request.params(data);
    request.get();
    request.execute(callback)
  }

  /**
   * @description 搜索通道
   */
  public static searchChannel(data: { page: number; size: number; key: string }, callback: (bool, res) => void) {
    const request = super.request("/dahua/GetPasList");
    request.params(data);
    request.get();
    request.execute(callback)
  }

  /**
   * @description 获取实时视频
   */
  public static getChannelVideo(data: { channelId: string }, callback: (bool, res) => void) {
    const request = super.request("/dahua/getVideoUrl");
    request.params(data);
    request.get();
    request.execute(callback)
  }

  /**
   * @description 获取录像
   */
  public static getRecordFile(data: GetRecords, callback: (bool, res) => void) {
    const request = super.request("/dahua/getrecordChannel");
    request.params(data);
    request.get();
    request.execute(callback)
  }

  /**
   * @description 获取回放视频资源
   */
  public static getPlayBackVideo(data:GetPlayBackUri, callback: (bool, res) => void) {
    const request = super.request("/dahua/getplayBackVideoUrl");
    request.params(data);
    request.get();
    request.execute(callback)
  }

  //
  // /**
  //  * @description 获取实时监控视频
  //  * @param {GetRealTimeUri} data
  //  * @param {(bool, res) => void} callback
  //  */
  // public static getRealTimeUri(data: GetRealTimeUri, callback: (bool, res) => void) {
  //   const request = super.completeUrl(videoHost + "/videoService/realmonitor/uri");// todo 请求url
  //   request.params(data);
  //   request.get();
  //   request.execute(callback)
  // }
  //
  // /**
  //  * @description 录像查询
  //  * @param {GetRecords} data
  //  * @param {(bool, res) => void} callback
  //  */
  // public static getRecordDetail(data: GetRecords, callback: (bool, res) => void) {
  //   const request = super.completeUrl(videoHost + "/videoService/record/records");// todo 请求url
  //   request.params(data);
  //   request.get();
  //   request.execute(callback)
  // }
  //
  // /**
  //  * @description 获取回访uri
  //  * @param {GetPlayBackUri} data
  //  * @param {(bool, res) => void} callback
  //  */
  // public static getPlayBackUrl(data: GetPlayBackUri, callback: (bool, res) => void) {
  //   const request = super.completeUrl(videoHost + "/videoService/playback/uri");// todo 请求url
  //   request.params(data);
  //   request.get();
  //   request.execute(callback)
  // }
}

interface GetRecords {
  channelId: string;// 必填 通道Id
  beginTime: string;// 必填。开始时间，UTC0时区时间，格式为YYYYMMDDTHHmmss
  endTime: string;// 必填。结束时间，UTC0时区时间，格式为YYYYMMDDTHHmmss
  location: number;// 必填。录像位置cloud 大华平台中心录像 ;device 设备录像 ; 3rdCloud 第三方平台录像
  recordType?: string;// 录像类型 normal 普通录像 alarm 报警录像 pluse 手动录像 motionDetect 动检录像
  recordSubType?: string;// 录像子类型，recordType为pluse时，表示自定义属性，自定义属性中的第一 类，报警联动录像，字典值为alarmLinkRecord。
  videoStream?: number;// 可以是main、extra1，不带参数表示不限类型。
  page?: number;// 仅在录像位置是3rdCloud时有效。查询结果中起始条目。不填写默认值为1。
  pageSize?: number;// 仅在录像位置是3rdCloud时有效。查询结果返回数量。不填写默认值为256
}

interface GetPlayBackUri {
  channelId: string;// 必填
  beginTime: string;// 必填。按文件和按时间回放都需要，开始回放时间。时间格式:YYYYMMDDTHHmmssZ。
  endTime: string;// 必填。按文件和按时间回放都需要，结束回放时间。时间格式:YYYYMMDDTHHmmssZ。
  location: string;// 必填。录像存储位置。cloud 平台录像 device 设备录像 3rdCloud 第三方平台录
  resource?: string;// 按文件回放需要，视频文件资源路径，可以通过录像查询的file字段获得，或者手动上传视频文件
  scheme?: string;//协议类型，支持RTSP、HLS两种。默认RTSP。
  duration?: number;//有效时间，单位为秒，最长不超过10分钟，默认10分钟。
  subtype?: number;// 选填。码流类型(0:主流、1:辅流1、2:辅流2)，默认主码流。绝大部分录像只有一种码流，无法选择。只对部分支持多码流同时录像的设备有意义，通常不用关心这个字段。
}
