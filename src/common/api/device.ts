// 云盯/华为视频
import { get } from '@/common/request/index';

export interface DeviceListAPIParams {
  id: number;
  hasHeatmap?: number;
}

export interface DeviceHWAPIParams {
  id: number;
  source: string;
}

/**
 * 门店设备列表 https://yapi.lanhanba.com/project/297/interface/api/33301
 */
export function deviceList(params: DeviceListAPIParams) {
  return get('/store/devices', params, true);
}

/**
 * 获取华为设备视频播放地址 https://yapi.lanhanba.com/project/297/interface/api/33398
 */
export function liveUrlHW(params: DeviceHWAPIParams) {
  return get('/device/videoUrl', params, true);
}

/**
 * 获取华为设备视频回放地址 https://yapi.lanhanba.com/project/297/interface/api/33399
 */
export function livePlaypackUrlHW(params: Record<string, any>) {
  return get('/device/playbackUrl', params, true);
}
