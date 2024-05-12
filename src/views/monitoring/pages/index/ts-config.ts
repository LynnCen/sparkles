export interface SearchParamsProps {
  storeId: number,
  videoType: number,
  HWDate: Date;
  YDTime: Date;
}

export interface HeadComProps {
  searchParams: SearchParamsProps,
  setSearchParams: Function;
  curDevice: DeviceListItem;
  stop: () => void;
  storeChangeHandle: (id: number) => void;
}

export interface DeviceListItem {
  /**
   * 设备id
   */
  id: number;
  /**
   * 设备名称
   */
  name: string;
  /**
   * 是否开启回放   1：开启 0：关闭
   */
  playbackStatus: number;
  /**
   * rtmp 播放地址
   */
  rtmpUrl: string;
  /**
   * 设备类型  YD:云盯  HW:华为
   */
  source: string;
  /**
   * 视频播放地址
   */
  url: string;
    /**
   * 设备sn码
   */
    sn: string;
}

