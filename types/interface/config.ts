export interface Config {
  [p: string]: any;
}

export interface RequestGet {
  (url: string, params: any, config?: RequestConfig | boolean | undefined): any;
}
export interface RequestPost {
  (url: string, data: any, config?: RequestConfig | boolean | undefined): any;
}

export interface GetScript {
  (name: string): any;
}
export interface GetCss {
  (name: string): any;
}

export interface RequestConfig {
  /** 是否需要切换路由时取消当前请求 */
  needCancel?: any;
  isMock?: boolean;
  mockId?: number | string;
  mockSuffix?: string;
  needHint?: boolean;
  isCheckSpot?: boolean; // 是否是踩点应用接口前缀
  isMirage?: boolean; // 是否是中台的动态表头项目
  isZeus?:boolean;// 鱼你-服务端 zeus项目
  /** 错误提示配置 */
  errorConfig?: {
    /** 是否需要直接打印提示 */
    needHint?: boolean;
    /** 错误显示时间 */
    duration?: number;
    /** 是否显示关闭按钮 */
    showClose?: boolean;
  };
  headers?: any;
}
